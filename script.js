// * ~~~~~~~~~~~~~~~~~~~ Api ~~~~~~~~~~~~~~~~~~~
const Api = (() => {
    // const baseUrl = "https://randomuser.me/api";
    const baseUrl = "https://randomuser.me";
    const path = "api";
    // const urlList = [];
    // for (let i = 0; i < 4; i++) {
    //     urlList.push(baseUrl);
    // }

    const getCards = () =>
        //     //     fetchJsonp([baseUrl, path].join("/"))
        //     //         .then((response) => response.json())
        //     //         .then((json) => console.log(json));

        fetch([baseUrl, path].join("/")).then((response) => response.json());

    // Promise.all(urlList.map((u) => fetch(u)))
    //     .then((respons) => respons.json()
    // );

    return {
        getCards,
    };
})();

// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~
const View = (() => {
    const domstr = {
        container: ".container",
        mainContainer: ".main-container",
        cardContainer: ".card-container",
        cardInfo: ".card-info",
        cardContent: "card-content",
        cardbtn: "card-btn",
        reloadbtn: "reload-btn",
    };

    const render = (ele, tmp) => {
        ele.innerHTML = tmp;
    };

    const creatTmp = (arr) => {
        let tmp = "";
        // console.log(arr[0].results[0]);
        arr.forEach((person) => {
            tmp += `
            <div class="card-container">
                <div class="card-content">
                    <div class="card-img">
                        <img src="${person.results[0].picture.medium}" />
                    </div>
                    <div class="card-info">
                        <p class="card-name">name: ${person.results[0].name.first} ${person.results[0].name.last}</p>
                        <p class="card-email">email: ${person.results[0].email}</p>
                        <p class="card-phone">phone: ${person.results[0].phone}</p>
                        <button class="card-btn">Show DOB</button>
                        <p class="card-dob" style='display:none;'>Birthday: ${person.results[0].dob.date}</p>
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
    const { getCards } = api;

    class State {
        #personlist = [];

        get personlist() {
            return this.#personlist;
        }

        set personlist(newpersonlist) {
            this.#personlist = newpersonlist;

            const mainContainer = document.querySelector(
                view.domstr.mainContainer
            );

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

    const showdob = () => {
        const cardInfo = document.querySelector(view.domstr.cardInfo);

        cardInfo.addEventListener("click", (event) => {
            if (event.target.className === "card-btn") {
                console.log(1);
            }
        });
    };

    const reload = () => {
        const container = document.querySelector(view.domstr.container);

        container.addEventListener("click", (event) => {
            if (event.target.className === "reload-btn") {
                init();
            }
        });
    };

    const init = async () => {
        const persons = [];

        for (let i = 0; i < 4; i++) {
            persons.push(await model.getCards());
        }

        state.personlist = persons;
    };

    const bootstrap = () => {
        init();
        showdob();
        reload();
    };

    return { bootstrap };
})(Model, View);

Controller.bootstrap();
