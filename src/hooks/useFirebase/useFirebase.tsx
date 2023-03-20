import { createContext, useContext, useEffect, useState } from "react";
import { FirebaseApp, initializeApp } from 'firebase/app';
import { useObjectVal } from 'react-firebase-hooks/database';
import { Database, getDatabase, ref, set, onChildAdded } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
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
  lastMove: BoardSquare[];
  whitePlayer: User | undefined,
  blackPlayer: User | undefined,
  myColor: 'white' | 'black';
  bothPlayersReady: boolean;
}

const FirebaseContext = createContext<FirebaseContextValues | undefined>(undefined);

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const movesDbPath = '/games/test/moves/';
  const whitePlayerDbPath = '/games/test/whitePlayer/';
  const blackPlayerDbPath = '/games/test/blackPlayer/';

  const movesRef = ref(db, movesDbPath);
  const whitePlayerRef = ref(db, whitePlayerDbPath);
  const blackPlayerRef = ref(db, blackPlayerDbPath);
  const usersRef = ref(db, '/users/');

  const [user, setUser] = useState<User>();
  const [lastMove, setLastMove] = useState<BoardSquare[]>([]);

  const [whitePlayer, wpLoading, wpError] = useObjectVal<User>(whitePlayerRef);
  const [blackPlayer, bpLoading, bpError] = useObjectVal<User>(blackPlayerRef);

  const bothPlayersReady = !!((whitePlayer && !wpLoading && !wpError)
    && (blackPlayer && !bpLoading && !bpError));

  const getMyColor = (): 'white' | 'black' => (
    user?.uid === whitePlayer?.uid ? 'white' : 'black'
  );

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

    // when new user is detected from firebase, default to making them white player first
    onChildAdded(usersRef, (snapshot) => {
      const newUser = snapshot.val();
      if (!whitePlayer) {
        set(ref(db, whitePlayerDbPath), { uid: newUser.uid });
        return;
      };
      set(ref(db, blackPlayerDbPath), { uid: newUser.uid });
    });

    // update state with the latest posted moves from firebase
    onChildAdded(movesRef, (snapshot) => {
      const newMoves = snapshot.val();
      setLastMove(newMoves);
    });
  }, [wpLoading]);

  const postToMovesFirebase = (moves: BoardSquare[]) => set(ref(db, movesDbPath + uuidv4()), moves);

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
