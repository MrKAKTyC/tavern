'use strict';

const spellDataPath = '/tavern/data/Закляття.json'

class SpeelList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        void fetch(spellDataPath).then((resp) => {
            resp.json().then((data) => {
                const filters = {
                    source: new Set(),
                    lvl: new Set(),
                    school: new Set(),
                    castingDuration: new Set(),
                    distance: new Set(),
                    effectDuration: new Set(),
                    components: new Set(),
                    classes: new Set(),
                }

                data?.forEach((spellData) => {
                    filters.source.add(spellData.source)
                    filters.lvl.add(spellData.lvl)
                    filters.school.add(spellData.school)
                    filters.castingDuration.add(spellData.castingDuration)
                    filters.distance.add(spellData.distance)
                    filters.effectDuration.add(spellData.effectDuration)
                    spellData.components.forEach(filters.components.add, filters.components)
                    spellData.classes.forEach(filters.classes.add, filters.classes)
                })

                this.setState({
                    filtersOptions: filters,
                    data
                })
            })
        })
    }

    setFilter(newValue, field) {
        const activeFilters = this.state.activeFilters || {}
        if (newValue.length) {
            activeFilters[field] = newValue
        } else {
            delete activeFilters[field]
        }
        this.setState({
            activeFilters
        })
    }

    render() {
        const activeFiltersData = this.state.activeFilters || {}
        const activeFilters = Object.keys(activeFiltersData)
        let spellDataList = this.state?.data
        if (activeFilters.length) {
            spellDataList = this.state?.data?.filter((spellData) => {
                const isNotFilter = activeFilters.find((filterName) => {
                    return !activeFiltersData[filterName].some(r=> spellData[filterName].includes(r))
                })
                return !isNotFilter
            })
        }

        const spellElemnts = spellDataList?.map((spellData) => {
            return (<Spell key={`${spellData.titleEn}-${spellData.source}`} spell={spellData} />)
        })

        const filterElements = Object.entries(this?.state?.filtersOptions || {}).map(([key, value]) => {
            const f = {
                name: key,
                options: value
            }
            return (<Filter key={key} filter={f} filterSetter={(newValue) => this.setFilter(newValue, key)} />)
        })
        return (
            <div>

                <input class="inp" type="text" id="search-input" placeholder="🔍︎ Пошук закляття" />
                <details class="parar">
                    <summary>
                        <p>
                            Фільтри
                            <img class="inpimg" src="../img/фільтр1.png" alt="" />
                        </p>

                        <hr />
                    </summary>
                    <p class="parartex" />
                    {filterElements}

                </details>

                {spellElemnts}

            </div>
        )
    }
}

class Filter extends React.Component {

    filterNames = {
        'source' : 'Джерело',
        'lvl' : 'Рівень',
        'school' : 'Школа',
        'castingDuration' : 'Час накладання',
        'distance' : 'Діапазон',
        'effectDuration' : 'Тривалість',
        'components' : 'Компонент',
        'classes' : 'Класи що володіють закляттям',
    }
    constructor(props) {
        super(props)
        this.state = {
            activeFilters: []
        }
    }

    toggeFilter(option) {
        let newFilters = [];
        if (this.state.activeFilters.includes(option)) {
            newFilters = this.state.activeFilters.filter((filter) => {
                return filter !== option
            })
        } else {
            newFilters = this.state.activeFilters.concat(option)
        }
        this.setState({ activeFilters: newFilters })
        this.props.filterSetter(newFilters)
    }

    clearFilter() {
        this.setState({ activeFilters: [] })
        this.props.filterSetter([])
    }

    isActive(option) {
        return this.state.activeFilters.includes(option) ? 'active' : ''
    }

    render() {
        const filterOptions = Array.from(this.props.filter?.options?.values()).map((option, i) => {
            return (
                <li class={'filt ' + this.isActive(option)} key={option} onClick={() => this.toggeFilter(option)}>
                    {option}
                </li>
            )
        })
        return (<div>
            <nav class="spellingp">
                <p class="pfil">{this.filterNames[this.props.filter.name]}</p>
                <ul>
                    <li class='filt ' onClick={() => this.clearFilter()}>
                        Всі
                    </li>
                    {filterOptions}
                </ul>
            </nav>
            <hr />
        </div>)
    }
}

class Spell extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.spell
        this.state.popup = {
            isOpen: false,
        }
        this.state.popup.class = this.state.popup.isOpen ? 'popup open' : 'popup'

        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);

    }

    openPopup() {
        this.setState({
            popup: {
                isOpen: true,
                class: 'popup open'
            }
        })
    }

    closePopup() {
        this.setState({
            popup: {
                isOpen: false,
                class: 'popup'
            }
        })
    }

    render() {
        return (
            <div>
                <a class="popup-link" href={`#	${this.state.titleEn}	 `} onClick={this.openPopup}>
                    <div class="searchable cardspell popup_link spell">
                        <img class="imgspell" src={`${this.state.image}`} alt="" />
                        <div>
                            <p class="cardnam"> {`${this.state.titleUa}`} </p>
                            <p class="carding"> {`${this.state.titleEn}`} </p>
                        </div>
                    </div>
                </a>
                <div class={this.state.popup.class} id={`	${this.state.titleEn}	 `}>
                    <div class="popup_body">
                        <div class="popup_content">
                            <a href="###" class="popup_close close-popup" onClick={this.closePopup}>Х</a>
                            <p class="cardnamp"> {`${this.state.titleUa}`} </p>
                            <p class="cardingp"> {`${this.state.titleEn}`} </p>
                            <p class="cardmatp"> {`${this.state.source}`} </p>
                            <p class="cardmatp"><b> {`${this.state.lvl}`} </b></p>
                            <p class="cardmatp"><b> </b></p>
                            <p class="cardmatp"><b>Школа:</b> {`${this.state.school}`} </p>
                            <p class="cardmatp"><b>Час накладання:</b> {`${this.state.castingDuration}`} </p>
                            <p class="cardmatp"><b>Діапазон:</b> {`${this.state.distance}`} </p>
                            <p class="cardmatp"><b>Тривалість:</b> {`${this.state.effectDuration}`} </p>
                            <p class="cardmatp"><b>Компонент:</b> {`${this.state.components}`} </p>
                            <p class="cardmatp"> </p>
                            <hr />
                            <p class="cardtex"> </p>
                            <p class="cardmatp"><b>Класи що володіють закляттям:</b> {`${this.state.classes}`} </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const domContainer = document.querySelector('.spells');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(SpeelList));