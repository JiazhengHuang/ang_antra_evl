// * ~~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~~
const Api = (() => {
    // const baseUrl = "https://randomuser.me/api";
    const baseUrl = "https://randomuser.me/api/?results=20";
    // const urlList = [];
    // for (let i = 0; i < 4; i++) {
    //     urlList.push(baseUrl);
    // }

    const getCards = () => fetch(baseUrl).then((response) => response.json());

    return {
        getCards,
    };
})();

// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~
const View = (() => {
    const domstr = {
        container: ".container",
        mainContainer: ".main-container",
        btncontainer: ".btncontainer",
        cardBtn: ".cardBtn",
    };

    const render = (ele, tmp) => {
        ele.innerHTML = tmp;
    };

    const creatTmp = (arr) => {
        let tmp = "";
        console.log(arr);
        arr.forEach((person) => {
            tmp += `
            <div class="card-container">
                <div class="card-content">
                    <div class="card-img">
                        <img src="${person.picture.large}" />
                    </div>
                    <div class="card-info">
                        <div class="card-name">name: ${person.name.first} ${person.name.last}</div>
                        <div class="card-email">email: ${person.email}</div>
                        <div class="card-phone">phone: ${person.phone}</div>
                        <div class="btncontainer">
                            <button id="cardBtn-${person.id}" class="cardBtn">Show DOB</button>
                        </div>
                        <div class="card-dob" id="card-dob-${person.id}" style='display:none;'>Birthday: ${person.dob.date}</div>
                    </div>
                </div>
            </div>`;
        });

        return tmp;
    };

    return {
        domstr,
        render,
        creatTmp,
    };
})();

// * ~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
    const generateRandomId = () => {
        const resouse =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        const length = 12;
        let id = "";
        for (let i = 0; i <= length; i++) {
            const index = Math.floor(Math.random() * resouse.length);
            id += resouse[index];
        }
        return id;
    };

    const { getCards } = api;

    class State {
        #personlist = [];

        get personlist() {
            return this.#personlist;
        }

        set personlist(newpersonlist) {
            this.#personlist = newpersonlist;
            this.#personlist.map((x) => {
                x.id = generateRandomId();
            });

            const mainContainer = document.querySelector(
                view.domstr.mainContainer
            );

            console.log(newpersonlist);

            const tmp = view.creatTmp(newpersonlist);
            view.render(mainContainer, tmp);
        }
    }

    return {
        getCards,
        State,
    };
})(Api, View);

// * ~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
    const state = new model.State();
    const container = document.querySelector(view.domstr.container);
    const mainContainer = document.querySelector(view.domstr.mainContainer);

    const init = () => {
        model.getCards().then((x) => (state.personlist = x.results));
    };

    const reload = () => {
        container.addEventListener("click", (event) => {
            if (event.target.className === "reload-btn") {
                init();
            }
        });
    };

    const showdob = () => {
        mainContainer.addEventListener("click", (event) => {
            if (event.target.className === "cardBtn") {
                const btnId = event.target.id;
                const btn = document.getElementById(btnId);
                btn.style.display = "none";

                const infoId = "card-dob-" + btnId.substring(8);
                const info = document.getElementById(infoId);
                info.style.display = "block";
            }
        });
    };

    const hidedob = () => {
        mainContainer.addEventListener("click", (event) => {
            if (event.target.className === "card-dob") {
                const infoId = event.target.id;
                const info = document.getElementById(infoId);
                info.style.display = "none";

                const btnId = "cardBtn-" + infoId.substring(9);
                const btn = document.getElementById(btnId);
                btn.style.display = "block";
            }
        });
    };

    const bootstrap = () => {
        init();
        reload();
        showdob();
        hidedob();
    };

    return { bootstrap };
})(Model, View);

Controller.bootstrap();
