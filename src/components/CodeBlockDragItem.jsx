import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';

export default function CodeBlockDragItem({ block, index }) {
  return (
    <Draggable draggableId={String(block.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-start gap-3 p-3 rounded-lg border font-mono transition select-none ${
            snapshot.isDragging
              ? 'bg-white border-brand shadow-floating ring-2 ring-brand/10 z-50'
              : 'bg-canvas-subtle border-border-subtle hover:border-border-active hover:bg-white text-content-primary'
          }`}
        >
          <div
            {...provided.dragHandleProps}
            className="pt-0.5 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <span className="text-xs text-content-muted font-mono w-4 pt-0.5 select-none text-right">
            {index + 1}
          </span>

          <pre className="text-slate-800 text-[13px] font-mono whitespace-pre overflow-x-auto flex-1">
            {block.code}
          </pre>
        </div>
      )}
    </Draggable>
  );
}