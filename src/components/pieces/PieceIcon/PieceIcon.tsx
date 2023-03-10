import React, { HTMLAttributes } from 'react';
import { ConnectDragSource, useDrag } from 'react-dnd';
import { Piece, PieceTypes } from '../../../pieces';
import BishopIcon from '../BishopIcon/BishopIcon';
import KingIcon from '../KingIcon/KingIcon';
import KnightIcon from '../KnightIcon/KnightIcon';
import PawnIcon from '../PawnIcon/PawnIcon';
import QueenIcon from '../QueenIcon/QueenIcon';
import RookIcon from '../RookIcon/RookIcon';

type PieceIconProps = {
  piece: Piece;
  onCooldown: boolean;
} & HTMLAttributes<HTMLDivElement>;

export type ChildIconProps = {
  piece: Piece;
  isDragging: boolean;
  dragRef: ConnectDragSource | null;
} & HTMLAttributes<HTMLDivElement>;

const PieceIcon: React.FC<PieceIconProps> = ({ piece, onCooldown, ...props }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'piece',
      item: piece,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  );

  const collectedProps = {
    piece,
    isDragging,
    dragRef: onCooldown ? null : drag,
    ...props,
  };

  switch (piece.name) {
    case PieceTypes.PAWN:
      return <PawnIcon {...collectedProps} />;
    case PieceTypes.QUEEN:
      return <QueenIcon {...collectedProps} />;
    case PieceTypes.KING:
      return <KingIcon {...collectedProps} />;
    case PieceTypes.BISHOP:
      return <BishopIcon {...collectedProps} />;
    case PieceTypes.KNIGHT:
      return <KnightIcon {...collectedProps} />;
    case PieceTypes.ROOK:
      return <RookIcon {...collectedProps} />;
    default: return null;
  }
};

export default PieceIcon;
