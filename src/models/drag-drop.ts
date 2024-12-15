// Drag & Drop Interfaces
// namespace
namespace App {
  // We can have the Draggable interface inside any class renders
  // an element is Draggable
  export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }

  // Project list class should be DragTargets
  export interface DragTarget {
    // Signal the browser that the thing you are dragging over is a valid thing
    dragOverHandler(event: DragEvent): void;
    // Permit the drop
    dropHandler(event: DragEvent): void;
    // To give some visual feedback to the user when drag and drop happens
    dragLeaveHandler(event: DragEvent): void;
  }
}
