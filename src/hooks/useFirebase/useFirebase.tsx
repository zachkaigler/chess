import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initializeApp } from 'firebase/app';
import { useObjectVal } from 'react-firebase-hooks/database';
import { getDatabase, ref, set, onChildAdded, push, remove, DatabaseReference } from 'firebase/database';
import { getAuth, signInAnonymously, signOut, User, onAuthStateChanged, Auth } from 'firebase/auth';
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

interface FirebaseContextValues {
  postToMovesFirebase(moves: BoardSquare[], gameUid?: string): void;
  postWinnerToFirebase(winner: 'white' | 'black' | 'draw'): void;
  createGame(): Promise<string | null | undefined>;
  togglePlayerReady(playerColor: 'white' | 'black'): void;
  cleanUpGame(): Promise<void>;
  lastMove: BoardSquare[];
  countdown: number;
  whitePlayer: Player | undefined,
  blackPlayer: Player | undefined,
  currentGame: Game | undefined,
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

interface Game {
  uid: string;
  status: 'not-started' | 'playing' | 'ended-white-win' | 'ended-black-win';
  whitePlayer?: Player;
  blackPlayer?: Player;
  moves: BoardSquare[];
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children, gameId }) => {
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = useMemo<Auth>(() => getAuth(app), []);

  const gamesDbPath = '/games/';
  const gamesRef = ref(db, gamesDbPath);

  const currentGameDbPath = useMemo<string>(() => `${gamesDbPath}${gameId}/`, [gameId]);
  const currentGameRef = useMemo<DatabaseReference>(() => ref(db, currentGameDbPath), [currentGameDbPath]);

  const [currentGame, cgLoading, cgError] = useObjectVal<Game>(currentGameRef);
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
  const [countdown, setCountdown] = useState<number>(3);

  const [whitePlayer, wpLoading, wpError] = useObjectVal<Player>(whitePlayerRef);
  const [blackPlayer, bpLoading, bpError] = useObjectVal<Player>(blackPlayerRef);

  const bothPlayersReady = !!((whitePlayer?.ready && !wpLoading && !wpError)
    && (blackPlayer?.ready && !bpLoading && !bpError));

  useEffect(() => {
    if (!bothPlayersReady) return;
    const interval = setInterval(() => {
      setCountdown((oldCount) => oldCount - 1);
    }, 1000);

    if (countdown === -1) set(currentGameRef, { ...currentGame, status: 'playing' });
    if (countdown === -2) clearInterval(interval);

    return () => clearInterval(interval);
  }, [bothPlayersReady, countdown]);

  const getMyColor = (): 'white' | 'black' => {
    if (user && whitePlayer) return user.uid === whitePlayer.uid ? 'white' : 'black';
    return 'white';
  };

  const togglePlayerReady = (playerColor: 'white' | 'black') => {
    if (playerColor === 'white') return set(ref(db, whitePlayerDbPath), { ...whitePlayer, ready: !whitePlayer?.ready });
    set(ref(db, blackPlayerDbPath), { ...blackPlayer, ready: !blackPlayer?.ready });
  };

  const createGame = async () => {
    try {
      const newRoomRef = await push(gamesRef, {
        status: 'not-started',
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

    const isWhitePlayer = user.uid === whitePlayer?.uid;
    const isBlackPlayer = user.uid === blackPlayer?.uid;

    if (isWhitePlayer || isBlackPlayer) return;

    if (!whitePlayer && !blackPlayer) {
      set(ref(db, whitePlayerDbPath), { uid: user.uid, ready: false });
      return;
    };

    if (whitePlayer && !blackPlayer && !isWhitePlayer) {
      set(ref(db, blackPlayerDbPath), { uid: user.uid, ready: false });
      return;
    }
  }, [gameId, invalidGame, cgLoading, whitePlayer, blackPlayer, user]);

  // init firebase listeners
  useEffect(() => {
    if (wpLoading) return;

    // anonymous sign in to firebase
    signInAnonymously(auth).catch(e => console.log(e.message));
    
    // handle auth changes
    onAuthStateChanged(auth, (_user) => {
      if (_user) {
        setUser(_user);
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

  const cleanUpGame = useCallback(async () => {
    const isWhitePlayer = user?.uid === whitePlayer?.uid;
    const isBlackPlayer = user?.uid === blackPlayer?.uid;
    if ((isWhitePlayer && !blackPlayer) || (isBlackPlayer && !whitePlayer)) await remove(ref(db, currentGameDbPath));
    if (isWhitePlayer) await remove(ref(db, whitePlayerDbPath));
    if (isBlackPlayer) await remove(ref(db, blackPlayerDbPath));
  }, [
    user,
    db,
    whitePlayer,
    whitePlayerDbPath,
    blackPlayer,
    blackPlayerDbPath,
    currentGameDbPath
  ]);

  const cleanUpData = useCallback(async () => {
    await cleanUpGame();
    await auth.currentUser?.delete();
  }, [
    auth,
    user,
    db,
    whitePlayer,
    whitePlayerDbPath,
    blackPlayer,
    blackPlayerDbPath,
    currentGameDbPath,
  ]);

  // clean up anonymous user and game data when the window is closed
  useEffect(() => {
    window.addEventListener('unload', cleanUpData);
    return () => window.removeEventListener('unload', cleanUpData);
  }, [
    auth,
    user,
    db,
    whitePlayer,
    whitePlayerDbPath,
    blackPlayer,
    blackPlayerDbPath,
    currentGameDbPath,
  ]);

  const postToMovesFirebase = async (moves: BoardSquare[], gameUid?: string) => {
    try {
      await push(
        gameUid ? ref(db, `/games/${gameUid}/moves/`) : currentGameRef,
        moves
      );
    } catch (e) {
      console.error(e);
    }
  };

  const postWinnerToFirebase = async (winner: 'white' | 'black' | 'draw') => {
    try {
      if (winner === 'draw') return set(currentGameRef, { ...currentGame, status: 'ended-draw' });
      await set(currentGameRef, { ...currentGame, status: winner === 'white' ? 'ended-white-win' : 'ended-black-win' });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FirebaseContext.Provider value={{
        postToMovesFirebase,
        postWinnerToFirebase,
        lastMove,
        currentGame,
        whitePlayer,
        blackPlayer,
        countdown,
        myColor: getMyColor(),
        bothPlayersReady,
        createGame,
        togglePlayerReady,
        invalidGame,
        cleanUpGame,
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
