/**
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * `projects-view`
 * 
 * @demo index.html
 * @element projects-view
 */
export class ProjectsView extends DDDSuper(LitElement) {

  static get tag() {
    return "projects-view";
  }

  constructor() {
    super();
    this.title = "Title";
    this.thumbnail = "impactra.png",
    this.link = "https://google.com",
    this.filtersList = new Set(),
    this.filteredData = [];
    this.data = [];
    this.activeFilter = '';

  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      thumbnail: {type: String},
      link: {type: String},
      filteredData: { type: Array},
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        
        /* min-width: 400px; */
        /* height: auto; */

        /* margin: var(--page-padding); */
        width: 100%;

      }
      *{
        box-sizing: border-box;
      }


      .container-background{
        margin: auto;
        max-width: var(--max-width); 
        background-color: var(--bg-color);
        /* background-color: gray; */
        /* overflow: hidden; */
        width: 100%;
        padding: var(--page-padding);
        min-height: 100vh;



    
      }
      .projects-header{
        display: flex;
        justify-content: space-between;
        padding: 50px 0;
        max-width: 100%;
      }
      .latest-projects{
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 1.7px;

      }
      .filters{
        display: flex;
        gap: 16px;
        flex-wrap: wrap;

      }
      .filters:hover{
        cursor: pointer;

      }

      .filter{
        font-family: "Inter", "Inter Placeholder", sans-serif;
        font-size: 16px;
        color: rgb(153, 153, 153);
      }
      .card-container {
        display: grid;
        /* border: 1px solid red; */
        grid-template-columns: repeat(2, minmax(200px, 1fr));
        gap: 45px;
        justify-content: center;
        /* width: 100vw; */
        overflow: hidden;
        max-width: var(--max-width);
        view-transition-name: cards;
      }

      item-card{
        height: auto;
      }


      h3 span {
        font-size: var(--graphic-portfolio-label-font-size, var(--ddd-font-size-s));
      }
      .filter.active {
        font-weight: bold;
      }

      @media (max-width: 575.98px) {
        .projects-header{
          flex-direction: column;
          gap: 16px;
          padding: 50px 0 20px 0;
        }
        .card-container {
         grid-template-columns: 1fr;
         gap: 25px;

        }
        .container-background{
        }
      }

    `];
  }

  // Lit render the HTML
  render() {
    return html`
          
<div class = "container-background">
  <div class="projects-header">

    <div class="latest-projects">LATEST PROJECTS</div>
    <div class="filters">
      <div class="filter active" name="all" @click="${this.updateFilter}">All</div>
      
        <!-- print filters -->
      ${Array.from(this.filtersList).map((filter) => html`
        <div @click="${this.updateFilter}" type="checkbox" name="${filter}"  class="filter"> 
          ${this.capitalizeWords(filter)} 
        </div>
      `)}

    </div>

  </div>
  <div class="card-container">

    ${this.filteredData.map((item)=>{ return html`
        <item-card class="card" 
        title="${item.title}" 
        thumbnail=${item.thumbnail}>
      </item-card>
      `})}
    </div> 
</div> 

`;
//   render() {
//     return html`
          
// <div class = "container-background">
//   <div class="projects-header">

//     <div class="latest-projects">LATEST PROJECTS</div>
//     <div class="filters">
//       <div class="filter active" name="all" @click="${this.updateFilter}">All</div>
      
//         <!-- print filters -->
//       ${Array.from(this.filtersList).map((filter) => html`
//         <div @click="${this.updateFilter}" type="checkbox" name="${filter}"  class="filter"> 
//           ${this.capitalizeWords(filter)} 
//         </div>
//       `)}

//     </div>

//   </div>

//   <div class="card-container">

//     ${this.filteredData.map((item)=>{ return html`
//         <item-card class="card" 
//         title="${item.title}" 
//         thumbnail=${item.thumbnail}>
//       </item-card>
//       `})}
//   </div>
// </div>  

// `;
  }

  capitalizeWords(sentence) {
    return sentence
      .split(" ")                             
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(" ");                             
  }

  fetchData(){
    let jsonUrl = new URL('../demo/data.json', import.meta.url).href
    fetch(jsonUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      this.data = [...data.data]; 
      //sort alphabetically
      this.data.sort((a, b) => a.title.localeCompare(b.title));
      this.filteredData = this.data; 

      //add tags to filters list (which is a *Set* to prevent dups)
      this.data.forEach((d) => {
        this.filtersList.add(d.tag);
      });          
      this.requestUpdate();
    })
    .catch(error => console.error('Error fetching the JSON:', error));

  }
    //update currentView to project when card is clicked
  _handleClick() {
    const event = new CustomEvent('item-click', {
      detail: { message: 'card clicked!', currentView: "project"  },
      bubbles: true,   // Makes the event bubble up to the parent
      composed: true,  // Allows the event to pass through shadow DOM boundaries
    });
    // console.log(event);
    
    this.dispatchEvent(event);  // Dispatch the event
  }
  

  getThumbnailUrl(){
    let url=new URL(`/lib/thumbnails/${this.thumbnail}`, import.meta.url).href;
    return url;
  }
  firstUpdated(){
    super.firstUpdated();
    this.fetchData();
  }

  _updateFilter(target, currentTarget){
    this.activeFilter = target.getAttribute("name");
    const filters = this.renderRoot.querySelectorAll('.filter');
    filters.forEach(el => el.classList.remove('active'));
    currentTarget.classList.add('active');
    this.filterData();
  }

  updateFilter(e){
    const target = e.target;
    const currentTarget = e.currentTarget;
    if (globalThis.document.startViewTransition) {
      globalThis.document.startViewTransition(() => {
        this._updateFilter(target, currentTarget);
      });
    }
    else {
      this._updateFilter(target, currentTarget);
    }
  }
  filterData(){

    if(this.activeFilter === 'all'){
      this.filteredData=this.data;
    } else{
      this.filteredData = [];
      this.data.forEach((item)=>{
        if(item.tag === this.activeFilter){ //check if filter includes item tag
          this.filteredData.push(item);
        }
    })
    
    }
  }
  
}

globalThis.customElements.define(ProjectsView.tag, ProjectsView);