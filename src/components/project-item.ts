/// <reference path="base-component.ts" />

namespace App {
  // ProjectItem Class
  export class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable
  {
    private project: Project;

    get persons() {
      if (this.project.people === 1) {
        return "1 person";
      } else {
        return `${this.project.people} persons`;
      }
    }

    constructor(hostId: string, project: Project) {
      // super("single-project", hostId, false, id);
      // new project should be at the top
      super("single-project", hostId, false, project.id);
      this.project = project;

      this.configure();
      this.renderContent();
    }

    @autobind
    dragStartHandler(event: DragEvent): void {
      // can be null because not all drag related event give you
      // data that can be transferred using a dataTransfer
      event.dataTransfer!.setData("text/plain", this.project.id);
      // how the cursor would look like and tells the browser our indication
      // that we are moving not copying - we remove stuff from one place
      // and paste it to another place
      event.dataTransfer!.effectAllowed = "move";
    }

    // @autobind
    dragEndHandler(_: DragEvent): void {
      console.log("DragEnd");
    }

    // 'this' causes issues when listening to eventHandlers
    // you can call .bind(this)
    // or here, I have a generalized implementation - a decorator - @autobind
    configure() {
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent() {
      this.element.querySelector("h2")!.textContent = this.project.title;
      this.element.querySelector("h3")!.textContent =
        this.persons + " assigned";
      this.element.querySelector("p")!.textContent = this.project.description;
    }
  }
}
