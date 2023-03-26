import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FirebaseApp, initializeApp } from 'firebase/app';
import { useObjectVal } from 'react-firebase-hooks/database';
import { Database, getDatabase, ref, set, onChildAdded, push, DatabaseReference } from 'firebase/database';
import { getAuth, signInAnonymously, signOut, User, onAuthStateChanged } from 'firebase/auth';
import { BoardSquare } from "../../game/game";

const firebaseConfig = {
  apiKey: 'AIzaSyCuriBpoBDHP07IAqF1N1e5iqHnyFd8BBQ',
  authDomain: 'chess-c4866.firebaseapp.com',
  databaseURL: 'https://chess-c4866-default-rtdb.firebaseio.com',
  projectId: 'chess-c4866',
  storageBucket: 'chess-c4866.appspot.com',
  messagingSenderId: '451538688788',
  appId: '1:451538688788:web:ffb56bd67a65a6202cc001'
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

interface FirebaseContextValues {
  firebase: FirebaseApp;
  db: Database;
  postToMovesFirebase(moves: BoardSquare[]): void;
  createGame(): Promise<string | null | undefined>;
  setPlayerReady(playerColor: 'white' | 'black'): void;
  lastMove: BoardSquare[];
  whitePlayer: User | undefined,
  blackPlayer: User | undefined,
  myColor: 'white' | 'black';
  bothPlayersReady: boolean;
  invalidGame: boolean;
}

const FirebaseContext = createContext<FirebaseContextValues | undefined>(undefined);

interface FirebaseProviderProps {
  children: React.ReactNode;
  gameId: string | undefined
}

type Player = {
  ready: boolean;
} & User;

// TODO:
// when both players are ready, start a countdown. at end of countdown, set status to playing
// do not allow moves to be made until game status on server is "playing"

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children, gameId }) => {
  const gamesDbPath = '/games/';
  const gamesRef = ref(db, gamesDbPath);

  const currentGameDbPath = `${gamesDbPath}${gameId}/`;
  const currentGameRef = useMemo<DatabaseReference>(() => ref(db, currentGameDbPath), [currentGameDbPath]);

  const [currentGame, cgLoading, cgError] = useObjectVal(currentGameRef);
  const invalidGame = !!(!cgLoading
    && (
      !currentGame || cgError
    )
  );

  const movesDbPath = `${currentGameDbPath}moves/`;
  const movesRef = ref(db, movesDbPath);

  const whitePlayerDbPath = `${currentGameDbPath}whitePlayer/`;
  const whitePlayerRef = ref(db, whitePlayerDbPath);

  const blackPlayerDbPath = `${currentGameDbPath}blackPlayer/`;
  const blackPlayerRef = ref(db, blackPlayerDbPath);

  const [user, setUser] = useState<User>();
  const [lastMove, setLastMove] = useState<BoardSquare[]>([]);

  const [whitePlayer, wpLoading, wpError] = useObjectVal<Player>(whitePlayerRef);
  const [blackPlayer, bpLoading, bpError] = useObjectVal<Player>(blackPlayerRef);

  const bothPlayersReady = !!((whitePlayer?.ready && !wpLoading && !wpError)
    && (blackPlayer?.ready && !bpLoading && !bpError));

  const getMyColor = (): 'white' | 'black' => {
    if (!user || !whitePlayer) return 'white';
    return user.uid === whitePlayer.uid ? 'white' : 'black';
  };

  const setPlayerReady = (playerColor: 'white' | 'black') => {
    if (playerColor === 'white') return set(ref(db, whitePlayerDbPath), { ...whitePlayer, ready: true });
    set(ref(db, blackPlayerDbPath), { ...blackPlayer, ready: true });
  };

  const createGame = async () => {
    try {
      const newRoomRef = await push(gamesRef, {
        status: 'not-playing',
      });
      return newRoomRef.key;
    } catch (e) {
      console.error(e);
    }
  };

  // when a user loads up a new game, add them as one of the players in the game
  useEffect(() => {
    if (cgLoading || !user) return;
    if (!gameId || invalidGame) return;
    if (whitePlayer && blackPlayer) return;

    if (!whitePlayer) {
      set(ref(db, whitePlayerDbPath), { uid: user.uid, ready: false });
      return;
    };
    if (whitePlayer && whitePlayer.uid != user.uid) {
      set(ref(db, blackPlayerDbPath), { uid: user.uid, ready: false });
      return;
    }
  }, [gameId, invalidGame, cgLoading, whitePlayer, user]);

  useEffect(() => {
    if (wpLoading) return;

    // anonymous sign in to firebase
    signInAnonymously(auth).catch(e => console.log(e.message));
    
    // handle auth changes
    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        setUser(_user);
        set(ref(db, `/users/${_user.uid}`), { uid: _user.uid });
      } else {
        signOut(auth);
      }
    });

    // update state with the latest posted moves from firebase
    onChildAdded(movesRef, (snapshot) => {
      const newMoves = snapshot.val();
      setLastMove(newMoves);
    });
  }, [wpLoading]);

  const postToMovesFirebase = (moves: BoardSquare[]) => {
    if (!gameId || invalidGame) return;
    push(movesRef, moves);
  };

  return (
    <FirebaseContext.Provider value={{
        firebase: app, 
        db,
        postToMovesFirebase,
        lastMove,
        whitePlayer,
        blackPlayer,
        myColor: getMyColor(),
        bothPlayersReady,
        createGame,
        setPlayerReady,
        invalidGame,
      }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const values = useContext(FirebaseContext);
  
  if (!values) throw new Error('useFirebase must be called within a FirebaseProvider');

  return values;
};
