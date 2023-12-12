class RatingWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.min = 1;
        this.max = 3;
        this.heading_color = 'black';
        this.heading_size = '2rem';
        this.star_color = 'red';
        this.star_size = '2rem';
        let heading = document.createElement('h3');
        let div = document.createElement('div');
        heading.innerHTML = 'Rating Widget'
        this.shadowRoot.appendChild(heading);
        this.shadowRoot.appendChild(div);
        heading = null;
        div = null;
    }

    connectedCallback() {
        // console.log('We are connected');
        this.setStars();
        let style = document.createElement('style');
        style.innerText = ` h3 {
                                font-size: ${this.heading_size};
                                color: ${this.heading_color};
                                margin: 0;
                            }
                            button {
                                background: none;
                                border: none;
                                padding: 0;
                                font-size: ${this.star_size};
                                color: ${this.star_color};
                                cursor: pointer;
                            }
                            `;
        this.shadowRoot.append(style);
        this.shadowRoot.addEventListener('click', this.selectRating);
        this.shadowRoot.addEventListener('mouseover', this.hoverRating);
        this.shadowRoot.addEventListener('mouseout', this.revertStar);
        this.selected_rating = 0;
        style = null;
    }

    disconnectedCallback() {
        // console.log('We are disconnected');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // console.log('Changed', name, oldValue, newValue, this);
        if(name === 'max') {
            if(newValue > 10) {
                this.max = 10;
            } else if(newValue < 2) {
                this.max = 2;
            } else {
                this.max = newValue;
            }
            this.setStars();
        } else if(name === 'data-starsize') {
            this.star_size = newValue;
        } else if(name === 'data-starcolor') {
            this.star_color = newValue;
        } else if(name === 'data-headingsize') {
            this.heading_size = newValue;
        } else if(name === 'data-headingcolor') {
            this.heading_color = newValue;
        } else if (name === 'min') {
            console.log(`This attribute doesn't do anything currently`);
        }
    }

    static get observedAttributes() {
        return ['min', 'max', 'data-starsize', 'data-starcolor', 'data-headingsize', 'data-headingcolor'];
    }

    setStars() {
        let star_holder = this.shadowRoot.querySelector('div');
        while(star_holder.firstChild) {
            star_holder.removeChild(star_holder.lastChild);
        }
        for(let i = 1; i <= this.max; i++) {
            let new_star = document.createElement('button');
            new_star.id = `star${i}`;
            new_star.innerHTML = `&#9734;`;
            new_star.ariaLabel = `${i} Star`;
            star_holder.appendChild(new_star);
        }
    }

    selectRating(event) {
        let id = event.target.id;
        if(id.includes('star')) {
            let number = id.replace('star', '');
            let star_list = this.querySelectorAll('button');
            for(let i = 0; i < star_list.length; i++) {
                if(i < number) {
                    star_list[i].innerHTML = `&#9733;`;
                } else {
                    star_list[i].innerHTML = `&#9734;`;
                }
            }
            let message = document.createElement('p');
            let div = this.querySelector('div');
            while(div.firstChild) {
                div.removeChild(div.lastChild);
            }
            this.selected_rating = number;
            if((this.selected_rating / star_list.length) >= 0.80) {
                message.innerHTML = `Thanks for the ${this.selected_rating} star rating!`;
                div.appendChild(message);
            } else {
                message.innerHTML = `Thanks for your feedback of ${this.selected_rating} star${this.selected_rating > 1 ? 's' : ''}. We'll try to do better!`;
                div.appendChild(message);
            }
            let form_data = new FormData();
            let headers = new Headers();
            headers.append('X-Sent-By', 'JS');
            // headers.append('Content-Type', 'application/x-www-form-urlencoded');
            form_data.append('question', 'How satisfied are you?');
            form_data.append('rating', this.selected_rating);
            // console.log(form_data);
            let request = {
                'method': 'POST',
                'headers': headers,
                'body': form_data
            }
            fetch('https://httpbin.org/post', {method: 'POST', headers: headers, body: form_data}).then((response) => {
                // console.log(response);
                if(response.status === 200) {
                    return response.json();
                } else {
                    console.log(`httpbin.org didn't respond in with a 200 status code! UH OH!`);
                } 
            }).then((response) => console.log(response));
        }   
    }

    hoverRating(event) {
        let id = event.target.id;
        if(id.includes('star')) {
            let number = id.replace('star', '');
            let star_list = this.querySelectorAll('button');
            for(let i = 0; i < star_list.length; i++) {
                if(i < number) {
                    star_list[i].innerHTML = `&#9733;`;
                } else {
                    star_list[i].innerHTML = `&#9734;`;
                }
            }
        }
        id = null;
    }

    revertStar(event) {
        let star_list = this.querySelectorAll('button');
        for(let i = 0; i < star_list.length; i++) {
            if(i < this.selected_rating) {
                star_list[i].innerHTML = `&#9733;`;
            } else {
                star_list[i].innerHTML = `&#9734;`;
            }
        }
    }
}

window.customElements.define('rating-widget', RatingWidget);