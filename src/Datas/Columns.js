import { Image, Space } from "antd";
const columns = [

    {
        title: 'Player Name',
        dataIndex: 'Player Name',
        key: 'playerName',
    },
    {
        title: "Jersey Number",
        dataIndex: "Jersey Number",
        key: "Jersey Number",
    },
    {
        title: "Starter",
        dataIndex: "Starter",
        key: "Starter",
    },
    {
        title: "Nationality",
        dataIndex: "Nationality",
        key: "Nationality",
    },
    {
        title: "Position",
        dataIndex: "Position",
        key: "Position",
    },
    {
        title: "Height",
        dataIndex: "Height",
        key: "Height",
        render: (height) => {
            // convert centimeters to meters and round to two decimals
            const meters = Math.round(height / 100 * 100) / 100;
            // return a string with the value and the unit
            return `${meters} m`;
          },
    },
    {
        title: "Weight",
        dataIndex: "Weight",
        key: "Weight",
        render: (weight) => {
            // return a string with the value and the unit
            return `${weight} kg`;
          },
    },
    {
        title: "Appearances",
        dataIndex: "Appearances",
        key: "Appearances",
    },
    {
        title: "Minutes Played",
        dataIndex: "Minutes Played",
        key: "Minutes Played",
    },
    {
        title: "Goals",
        dataIndex: "Goals ",
        key: "Goals ",

    },
];
export default columns