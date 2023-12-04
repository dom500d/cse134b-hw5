class RatingWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let heading = document.createElement('h3');
        let div = document.createElement('div');
        heading.innerHTML = 'Rating Widget'
        this.shadowRoot.appendChild(heading);
        this.shadowRoot.appendChild(div);
        heading = null;
        div = null;
    }

    connectedCallback() {
        console.log('We are connected');
        this.setStars();
        let style = document.createElement('style');
        style.innerText = `span {
            font-size: ${this.fontsize};
        }
        h3 {
            font-size: ${this.fontsize};
            margin: 0;
        }`;
        this.shadowRoot.append(style);
        style = null;
    }

    disconnectedCallback() {
        console.log('We are disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('Changed', name, oldValue, newValue, this);
        if(name === 'max') {
            this.max = newValue;
        } else if(name === 'fontsize') {
            this.fontsize = newValue;
        }
    }

    static get observedAttributes() {
        return ['min', 'max', 'fontsize'];
    }

    setStars() {
        let star_holder = this.shadowRoot.querySelector('div');
        for(let i = 1; i <= this.max; i++) {
            let new_star = document.createElement('span');
            new_star.id = `star${i}`;
            new_star.innerHTML = `&#9734;`;
            star_holder.appendChild(new_star);
        }
    }

    
}

window.customElements.define('rating-widget', RatingWidget);