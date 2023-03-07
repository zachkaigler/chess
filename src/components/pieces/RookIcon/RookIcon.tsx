import React from 'react'
import { useDrag } from 'react-dnd';
import { Rook } from '../../../pieces';

interface RookIconProps {
  piece: Rook;
}

const RookIcon: React.FC<RookIconProps> = ({ piece }) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'piece',
      item: piece,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [],
  )

  // TODO: replace with an actual icon
  return (
    <div
      ref={drag}
      style={{
        width: '70%',
        aspectRatio: '1 / 1',
        borderRadius: '50%',
        backgroundColor: piece.color,
        color: piece.color === 'black' ? 'white' : 'black',
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
        opacity: isDragging ? 0.5 : 1,
        userSelect: 'none',
      }}
    >
      R
    </div>
  )
}

export default RookIcon;
