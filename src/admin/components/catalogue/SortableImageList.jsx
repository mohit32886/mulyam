import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Image as ImageIcon } from 'lucide-react'

/**
 * Single sortable image item
 */
function SortableImageItem({ id, url, index, onRemove, isDragOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isFirst = index === 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 p-3 bg-admin-card-hover rounded-lg
        ${isDragging ? 'opacity-50' : ''}
        ${isDragOverlay ? 'shadow-2xl ring-2 ring-orange-500' : ''}
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-neutral-500 hover:text-neutral-300 cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* Image Preview */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-admin-card flex-shrink-0">
        {url ? (
          <img
            src={url}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-neutral-600" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-300">
            {isFirst ? 'Main Image' : `Image ${index + 1}`}
          </span>
          {isFirst && (
            <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded">
              Primary
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 truncate mt-1">
          {url || 'No URL'}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(index)}
        className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * Image item for drag overlay (rendered when dragging)
 */
function ImageDragOverlay({ url, index }) {
  const isFirst = index === 0

  return (
    <div className="flex items-center gap-3 p-3 bg-admin-card-hover rounded-lg shadow-2xl ring-2 ring-orange-500">
      <div className="p-1 text-neutral-300">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="w-16 h-16 rounded-lg overflow-hidden bg-admin-card flex-shrink-0">
        {url ? (
          <img
            src={url}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-neutral-600" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-300">
            {isFirst ? 'Main Image' : `Image ${index + 1}`}
          </span>
          {isFirst && (
            <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded">
              Primary
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Sortable image list component with drag and drop reordering
 */
export default function SortableImageList({ images = [], onChange, onRemove }) {
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Create unique IDs for each image (using index as fallback)
  const items = images.map((url, index) => ({
    id: `image-${index}-${url?.slice(-20) || 'empty'}`,
    url,
    index,
  }))

  const activeItem = activeId ? items.find(item => item.id === activeId) : null

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(images, oldIndex, newIndex)
        onChange(newImages)
      }
    }
  }

  const handleRemove = (index) => {
    onRemove(index)
  }

  if (images.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-admin-border rounded-lg text-center">
        <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm text-neutral-500">No images added yet</p>
        <p className="text-xs text-neutral-600 mt-1">
          Upload images above or drag and drop files
        </p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableImageItem
              key={item.id}
              id={item.id}
              url={item.url}
              index={item.index}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem ? (
          <ImageDragOverlay url={activeItem.url} index={activeItem.index} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
