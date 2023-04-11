
class AbilityTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            subclass: 'default'
        };

        this.setSubclass = this.setSubclass.bind(this);
    }


    componentDidMount() {
        fetch('/tavern/data/class/bard.json')
            .then(response => response.json())
            .then(data => this.setState({ data }))
            .catch(error => console.error('Error fetching data:', error));
    }

    setSubclass(subclass) {
        this.setState({ subclass: subclass })
    }

    render() {
        const { data } = this.state;
        if (!data) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <div className="filt" onClick={() => this.setSubclass('default')}>Bard</div>
                <div className="filt" onClick={() => this.setSubclass('College of Valor')}>College of Valor</div>
                <div className="filt" onClick={() => this.setSubclass('College of Lore')}>College of Lore</div>
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Abilities</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data).map(([level, abilities]) => (
                            <tr key={level}>
                                <td style={{ width: "10%" }}>{level}</td>
                                <td style={{ width: "90%" }}>
                                    {abilities.map((ability, index) => (
                                        (ability.origin === 'default' || ability.origin === this.state.subclass) && (<div key={index}>
                                            <div style={{color: ability.origin === 'default' ? 'DarkBlue' : 'DarkGreen'}}>{ability.ability}</div>
                                        </div>)

                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}


const domContainer = document.querySelector('.class');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(AbilityTable));