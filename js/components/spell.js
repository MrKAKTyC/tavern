'use strict';

const spellDataPath = '/tavern/data/Закляття.json'

class SpeelList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeFilters: {},
            filtersOptions: [],
            searchQuery: '',
            spellListData: null
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    async componentDidMount() {
        const response = await fetch(spellDataPath);
        const spellListData = await response.json();
        const filters = {
            lvl: new Set(),
            classes: new Set(),
            school: new Set(),
            components: new Set(),
            isRitual: new Set(),
            distance: new Set(),
            castingDuration: new Set(),
            effectDuration: new Set(),
            concentration: new Set(),
            source: new Set(),
        }

        spellListData?.forEach((spellData) => {
            filters.source.add(spellData.source)
            filters.lvl.add(spellData.lvl)
            filters.school.add(spellData.school)
            filters.castingDuration.add(spellData.castingDuration)
            filters.distance.add(spellData.distance)
            filters.effectDuration.add(spellData.effectDuration)
            filters.isRitual.add(spellData.isRitual)
            filters.concentration.add(spellData.concentration)
            spellData.components.forEach(filters.components.add, filters.components)
            spellData.classes.forEach(filters.classes.add, filters.classes)
        })

        this.setState({
            filtersOptions: filters,
            spellListData
        })

    }

    handleSearchChange(event) {
        this.setState({ searchQuery: event.target.value });
    }

    setFilter(newValue, field) {
        this.setState(prevState => {
            const { activeFilters } = prevState;
            if (newValue.length) {
                return { activeFilters: { ...activeFilters, [field]: newValue } };
            } else {
                const { [field]: value, ...newFilters } = activeFilters;
                return { activeFilters: newFilters };
            }
        });
    }

    render() {
        const { activeFilters, searchQuery, spellListData } = this.state
        const activeFiltersKeys = Object.keys(activeFilters);

        const filteredSpellListData = spellListData?.filter(
            (spellData) => {
                const isNotInFilter = activeFiltersKeys.every((filterName) => {
                    const filterValues = activeFilters[filterName];
                    const spellDataValues = Array.isArray(spellData[filterName]) ? spellData[filterName] : [spellData[filterName]];
                    return filterValues.some((filterValue) => spellDataValues.includes(filterValue));
                });
                const isInSearch = spellData.titleUa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    spellData.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
                return isNotInFilter && isInSearch;


            }
        );

        const spellElemnts = filteredSpellListData?.map((spellData) => {
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
                <input className="inp" type="text" placeholder="🔍︎ Пошук закляття" value={searchQuery} onChange={this.handleSearchChange} />

                <details className="parar">
                    <summary>
                        <p>
                            Фільтри
                            <img className="inpimg" src="../img/фільтр1.png" alt="" />
                        </p>

                        <hr />
                    </summary>
                    <p className="parartex" />
                    {filterElements}

                </details>

                {spellElemnts}

            </div>
        )
    }
}

class Filter extends React.Component {

    filterNames = {
        'lvl': 'Рівень',
        'classes': 'Клас',
        'school': 'Школа',
        'components': 'Компонент',
        'isRitual': 'Ритуал',
        'distance': 'Діапазон',
        'castingDuration': 'Час накладання',
        'effectDuration': 'Тривалість',
        'concentration': 'Концентрація',
        'source': 'Джерело',
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
        const {options, name} = this.props.filter

        const filterOptions = Array.from(options?.values()).map((option, i) => {
            const opt = typeof option === 'string' ? option : option ? 'Так' : 'Ні';
            return (
                <li className={'filt ' + this.isActive(option)} key={option} onClick={() => this.toggeFilter(option)}>
                    {opt}
                </li>
            )
        })
        return (<div>
            <nav className="spellingp">
                <p className="pfil">{this.filterNames[name]}</p>
                <ul>
                    <li className='filt ' onClick={() => this.clearFilter()}>
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
        this.state = {
            spell: props.spell,
            isPopupOpen: false,
        }

        this.openPopup = this.openPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);

    }

    openPopup() {
        this.setState({
            isPopupOpen: true
        })
    }

    closePopup() {
        this.setState({
            isPopupOpen: false
        })
    }

    render() {
        const { isPopupOpen, spell } = this.state
        return (
            <div>
                <a className="popup-link" onClick={this.openPopup}>
                    <div className="searchable cardspell popup_link spell">
                        <img className="imgspell" src={`${spell.image}`} alt="" />
                        <div>
                            <p className="cardnam"> {`${spell.titleUa}`} </p>
                            <p className="carding"> {`${spell.titleEn}`} </p>
                        </div>
                    </div>
                </a>
                {isPopupOpen && <Popup closePopup={() => this.closePopup()}>
                    <p className="cardnamp"> {`${spell.titleUa}`} </p>
                    <p className="cardingp"> {`${spell.titleEn}`} </p>
                    <p className="cardmatp"> {`${spell.source} ${spell.sourceLink ?? ''}`} </p>
                    <p className="cardmatp"><b> {`${spell.lvl}`} </b></p>
                    <p className="cardmatp"><b> {spell.isRitual && 'Ритуал'} </b></p>
                    <p className="cardmatp"><b>Школа:</b> {`${spell.school}`} </p>
                    <p className="cardmatp"><b>Час накладання:</b> {spell.concentration && 'Концентрація, '}{`${spell.castingDuration}`} </p>
                    <p className="cardmatp"><b>Діапазон:</b> {`${spell.distance}`} </p>
                    <p className="cardmatp"><b>Тривалість:</b> {`${spell.effectDuration}`} </p>
                    <p className="cardmatp"><b>Компонент:</b> {`${spell.components}`} </p>
                    <p className="cardmatp"> </p>
                    <hr />
                    <p className="cardtex"> </p>
                    <p className="cardmatp"><b>Класи що володіють закляттям:</b> {`${spell.classes}`} </p>
                </Popup>}
            </div>
        );
    }
}

const domContainer = document.querySelector('.spells');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(SpeelList));