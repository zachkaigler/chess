import React from 'react';
import { ConnectDragSource, useDrag } from 'react-dnd';
import { Piece, PieceTypes } from '../../../pieces';
import BishopIcon from '../BishopIcon/BishopIcon';
import KingIcon from '../KingIcon/KingIcon';
import KnightIcon from '../KnightIcon/KnightIcon';
import PawnIcon from '../PawnIcon/PawnIcon';
import QueenIcon from '../QueenIcon/QueenIcon';
import RookIcon from '../RookIcon/RookIcon';

interface PieceIconProps {
  piece: Piece;
  onCooldown: boolean;
}

export interface ChildIconProps {
  piece: Piece;
  isDragging: boolean;
  dragRef: ConnectDragSource | null;
}

const PieceIcon: React.FC<PieceIconProps> = ({ piece, onCooldown }) => {
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

  const props = {
    piece,
    isDragging,
    dragRef: onCooldown ? null : drag,
  };

  switch (piece.name) {
    case PieceTypes.PAWN:
      return <PawnIcon {...props} />;
    case PieceTypes.QUEEN:
      return <QueenIcon {...props} />;
    case PieceTypes.KING:
      return <KingIcon {...props} />;
    case PieceTypes.BISHOP:
      return <BishopIcon {...props} />;
    case PieceTypes.KNIGHT:
      return <KnightIcon {...props} />;
    case PieceTypes.ROOK:
      return <RookIcon {...props} />;
    default: return null;
  }
};

export default PieceIcon;
