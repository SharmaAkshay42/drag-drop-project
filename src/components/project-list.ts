/// <reference path="base-component.ts" />

namespace App {
  // Projectlist
  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    // @autobind because the below use eventHandlers which mess up 'this'
    @autobind
    dragOverHandler(event: DragEvent): void {
      // Is the drag really is allowed? I don't wanna make everything draggable
      // I don't want to allow dropping say images
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        // Drop is only allowed if in the drag overhandler of the same element
        // The default for js drag-n-drop is to not allow dropping
        event.preventDefault();
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }

    @autobind
    dropHandler(event: DragEvent): void {
      // At the point of dropping, we will be able to get the data being transferred
      // console.log(event);
      // console.log(event.dataTransfer!.getData("text/plain"));
      const prjId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        prjId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    private renderProjects() {
      const listEl = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;
      // To avoid duplication issue - clear listEl's innerHTML
      // If you already have projects, say Prj1, adding Prj2 will
      // duplicate Prj1. So, you'll get - Prj1, Prj1, Prj2
      // We clear the list of all projects & then we re-render
      // Some performance hit, but for this small project, it should be ok
      listEl.innerHTML = "";
      for (const prjItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
      }
    }

    configure() {
      // to make sure the drag handler is actually fired when we drag
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);
      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((prj) => {
          if (this.type === "active") {
            return prj.status === ProjectStatus.Active;
          }
          return prj.status === ProjectStatus.Finished;
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    // fill the blank spaces in the template with info
    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }

    // attach something & render it to the DOM
  }
}
