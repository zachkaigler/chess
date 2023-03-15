import React from 'react';
import { BoardSquare } from '../../../game/game';
import { PieceTypes } from '../../../game/pieces';
import { useGameController } from '../../../hooks/useGameController/useGameController';
import BishopIcon from '../../pieces/BishopIcon/BishopIcon';
import KnightIcon from '../../pieces/KnightIcon/KnightIcon';
import QueenIcon from '../../pieces/QueenIcon/QueenIcon';
import RookIcon from '../../pieces/RookIcon/RookIcon';
import BoardSquareTile from '../BoardSquareTile/BoardSquareTile';
import './PromotionPanel.scss';

interface PromotionPanelProps {
  square: BoardSquare;
}

const PromotionPanel: React.FC<PromotionPanelProps> = ({ square }) => {
  const { promotePawn } = useGameController();

  const getPanelAnchor = () => {
    if (square.id === 1 || square.id === 57) return 'left';
    return 'right';
  };

  // TODO: this stuff may need to change when perspective is flipped for black?
  const anchor = getPanelAnchor();
  const color = square.id >= 57 && square.id <= 64 ? 'white' : 'black';
  const alignment = color === 'black' ? 'bottom' : 'top';

  const opts = {
    queen: (
      <BoardSquareTile key='promotion-panel-02' onClick={() => promotePawn(square, PieceTypes.QUEEN)}>
        <QueenIcon color={color} dragRef={null} />
      </BoardSquareTile>
    ),
    rook: (
      <BoardSquareTile key='promotion-panel-01' onClick={() => promotePawn(square, PieceTypes.ROOK)}>
        <RookIcon color={color} dragRef={null} />
      </BoardSquareTile>
    ),
    bishop: (
      <BoardSquareTile key='promotion-panel-03' onClick={() => promotePawn(square, PieceTypes.BISHOP)}>
        <BishopIcon color={color} dragRef={null} />
      </BoardSquareTile>
    ),
    knight: (
      <BoardSquareTile key='promotion-panel-04' onClick={() => promotePawn(square, PieceTypes.KNIGHT)}>
        <KnightIcon color={color} dragRef={null} />
      </BoardSquareTile>
    ),
  };

  const optsTopRight = [opts.rook, opts.queen, opts.bishop, opts.knight];
  const optsTopLeft = [opts.queen, opts.rook, opts.knight, opts.bishop];
  const optsBtmRight = [opts.bishop, opts.knight, opts.rook, opts.queen];
  const optsBtmLeft = [opts.knight, opts.bishop, opts.queen, opts.rook];

  return (
    <div className={`PromotionPanel__Container ${anchor === 'left' ? 'anchor-left' : 'anchor-right'} ${color === 'black' ? 'bottom' : 'top'}`}>
      {alignment === 'top' && anchor === 'right' && optsTopRight}
      {alignment === 'top' && anchor === 'left' && optsTopLeft}
      {alignment === 'bottom' && anchor === 'right' && optsBtmRight}
      {alignment === 'bottom' && anchor === 'left' && optsBtmLeft}
    </div>
  );
};

export default PromotionPanel;
