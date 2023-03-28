import React, { CSSProperties, HTMLAttributes } from 'react';
import { ConnectDragSource, useDrag } from 'react-dnd';
import { BoardSquare } from '../../../game/game';
import { PieceTypes } from '../../../game/pieces';
import { useFirebase } from '../../../hooks/useFirebase/useFirebase';
import { useGameController } from '../../../hooks/useGameController/useGameController';
import BishopIcon from '../BishopIcon/BishopIcon';
import KingIcon from '../KingIcon/KingIcon';
import KnightIcon from '../KnightIcon/KnightIcon';
import PawnIcon from '../PawnIcon/PawnIcon';
import QueenIcon from '../QueenIcon/QueenIcon';
import RookIcon from '../RookIcon/RookIcon';

type PieceIconProps = {
  square: BoardSquare;
  onCooldown: boolean;
} & HTMLAttributes<HTMLDivElement>;

export type ChildIconProps = {
  color: string;
  dragRef: ConnectDragSource | null;
} & HTMLAttributes<HTMLDivElement>;

const PieceIcon: React.FC<PieceIconProps> = ({ square, onCooldown, ...props }) => {
  const { gameState } = useGameController();
  const { myColor, bothPlayersReady } = useFirebase();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'square',
      item: square,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [square],
  );

  const collectedProps = {
    color: square.piece!.color,
    dragRef: onCooldown || gameState !== 'playing' || myColor !== square.piece!.color ? null : drag,
    ...props,
  };

  const styles: CSSProperties = {
    transform: myColor === 'black' ? 'rotate(180deg)' : '',
    cursor: square.piece?.color !== myColor || !bothPlayersReady ? 'default' : square.showPromotionPanel ? 'pointer' : isDragging ? 'grabbing' : 'grab',
    zIndex: 2,
  };

  switch (square.piece?.name) {
    case PieceTypes.PAWN:
      return <PawnIcon {...collectedProps} style={styles} />;
    case PieceTypes.QUEEN:
      return <QueenIcon {...collectedProps} style={styles} />;
    case PieceTypes.KING:
      return <KingIcon {...collectedProps} style={styles} />;
    case PieceTypes.BISHOP:
      return <BishopIcon {...collectedProps} style={styles} />;
    case PieceTypes.KNIGHT:
      return <KnightIcon {...collectedProps} style={styles} />;
    case PieceTypes.ROOK:
      return <RookIcon {...collectedProps} style={styles} />;
    default: return null;
  }
};

export default PieceIcon;
