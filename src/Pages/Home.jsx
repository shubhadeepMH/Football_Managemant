// Import React and Ant Design components
import { useState, useEffect } from "react";
import { RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { Layout, Menu, Input, Button, Upload, Table, Popconfirm, Dropdown, message, Modal, Select, Radio, InputNumber, Form, Image, ConfigProvider } from "antd";
import { SearchOutlined, EditOutlined, UploadOutlined, ExclamationCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { MdMenu, MdGroups, MdTrendingUp, MdDiversity1 } from "react-icons/md";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Papa from 'papaparse'
import columns from "../Datas/Columns";
import columnTwo from "../Datas/ColoumnTwo";

import nationalityOptions from '../Datas/Nationality'
import positionOptions from '../Datas/Positions'
import GlobalStyle from "../Datas/GlobalCss";


// Import logo image
import logo from '../assets/footballLogo.png'
import ImporterModal from "../Components/ImportFilePopUp";
import { addTeam, updateFileName, updatePlayerData } from "../../Store/Slices/TeamSlice";
import { NavLink } from "react-router-dom";



// Define the layout components
const { Sider, Header, Content } = Layout;

// Define the App component
function Home() {
    const [visible, setVisible] = useState(false);
    const [team, setTeam] = useState('My Team')
    const [fileName, setFileName] = useState()
    const [teamChoose, setTeamChoosed] = useState(false)
    const [fileColumn, setFileColumn] = useState([]);
    const [fileValue, setFileValue] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState()
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState()
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [editPopUpModal, setEditPopUpModal] = useState(false)
    const [previewTableData, setPreviewTableData] = useState()
    const [isMissingField, setIsMissingField] = useState(false)
    const [form] = Form.useForm();
    const [editFileNamePopUp, setEditFileNamePopUp] = useState(false)
    const [tempFileName, setTempFileName] = useState('')
    let [players, setPlayers] = useState([]);
    const [importPopUp, setImportPopUp] = useState(false)
    const [page, setPage] = useState(1)
    const fileInputRef = useRef(null);
    const [mainPlayersData, setMainPlayersData] = useState();//Storing Players Data to show on the table for this page
    const [searchValue, setSearchValue] = useState('');
    let dispatch = useDispatch()


    // Data for table two
    useEffect(() => {
        const data = [
            mainPlayersData && {
                key: "1",
                total: mainPlayersData.length,
                goalkeepers: mainPlayersData.filter((player) => player["Position"] === "Goalkeeper").length,
                defenders: mainPlayersData.filter((player) => player["Position"] === "Defender").length,
                midfielders: mainPlayersData.filter((player) => player["Position"] === "Midfielder").length,
                forwards: mainPlayersData.filter((player) => player["Position"] === "Forward").length,
            },
        ];

        setPreviewTableData(data)
    }, [mainPlayersData])

    //Fetching Data Redux Store player Data To The Application


    let storeData = useSelector((state) => state.TeamSlice)

    useEffect(() => {
        if (storeData.fileName) {

            setMainPlayersData(storeData.data)
            setTeam(storeData.fileName)
        }
    })
    // Search Field Key Press Handling
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setSearchValue('')
            setMainPlayersData(storeData.data)

        }
        if (event.key === 'x') {
            setSearchValue('')
            setMainPlayersData(storeData.data)
        }

    }

    // Handling edit file name on ok
    const handleEditFileNameOk = () => {
        setEditFileNamePopUp(false)
        dispatch(updateFileName(tempFileName))
        setTempFileName('')
    }
    // Handling edit file name on cancel
    const handleEditFileNameCancel = () => {
        setEditFileNamePopUp(false)
        setTempFileName('')
    }
    // Use effect for change player array data on search
    useEffect(() => {
        const filteredData = mainPlayersData && mainPlayersData.filter((player) =>
            player["Player Name"].toLowerCase().includes(searchValue.toLowerCase())
        );
        setMainPlayersData(filteredData);
        if (searchValue.length == 0) {
            setMainPlayersData(storeData.data)
        }
    }, [searchValue, mainPlayersData]);

    // Use a useEffect hook to set the initial form values
    useEffect(() => {
        if (selectedPlayer) {
            // Set the modal visibility to true
            setVisible(true);
            // Set the form values with the selected player data
            form.setFieldsValue({
                playerName: selectedPlayer["Player Name"],
                jerseyNumber: selectedPlayer["Jersey Number"],
                height: selectedPlayer["Height"],
                weight: selectedPlayer["Weight"],
                nationality: selectedPlayer["Nationality"],
                position: selectedPlayer["Position"],
                starter: selectedPlayer["Starter"],
            });
        }
    }, [selectedPlayer, form]);

    // Searchin for player
    const handleSearch = (e) => {
        e.target.value != 'x' && setSearchValue(e.target.value)
        if (searchValue.length == 0) {
            setMainPlayersData(storeData.data)
        }
    }
    // Define Handle Ok Function
    const handleEditOk = () => {
        // Validate the form fields
        form.validateFields().then((values) => {
            // Create a new object with updated values
            const updatedPlayer = {
                ...selectedPlayer,
                "Player Name": values.playerName,
                "Jersey Number": values.jerseyNumber,
                "Height": values.height,
                "Weight": values.weight,
                "Nationality": values.nationality,
                "Position": values.position,
                "Starter": values.starter,
            };



            // Set the players state with the updated data
            let changingPlayer = mainPlayersData;
            changingPlayer = changingPlayer.map((player) => {
                return (player["Player Name"] === selectedPlayer["Player Name"] ? updatedPlayer : player)
            })

            setMainPlayersData(changingPlayer)
            //   Dispatching The Edited  Data To Redux Store
            dispatch(updatePlayerData(changingPlayer))




            // Set the modal visibility to false
            setVisible(false);
            setEditPopUpModal(false);
            setSelectedPlayer(null)

            // Reset the form fields
            form.resetFields();
        });
    };

    // Handle Import cancel
    const handleImportCancel = () => {
        // Set the modal visibility to false
        setImportPopUp(false)
        setIsMissingField(false)
        setPreviewTableData(null)
        setTeam("My Team")
        // Reset the players data and the file name
        setPlayers([]);

    };

    const handleFileChange = async (event) => {
        Papa.parse(event.target.files[0], {
            complete: (result) => {
                if (result.data.length > 0) {
                    const keys = result.data[0];
                    const transformedData = result.data.slice(1, result.data.length - 1).map((values, rowIndex) => {
                        const obj = {};
                        keys.forEach((key, index) => {
                            if (!values[index]) {
                                setIsMissingField(true)
                            } else {
                                obj[key] = values[index];
                            }



                        });
                        return obj;
                    });


                    setPlayers(transformedData)
                    // Data for second(import preview)table
                    const data = [
                        {
                            key: "1",
                            total: transformedData.length,
                            goalkeepers: transformedData.filter((player) => player["Position"] === "Goalkeeper").length,
                            defenders: transformedData.filter((player) => player["Position"] === "Defender").length,
                            midfielders: transformedData.filter((player) => player["Position"] === "Midfielder").length,
                            forwards: transformedData.filter((player) => player["Position"] === "Forward").length,
                        },
                    ];
                    setPreviewTableData(data)
                    setTeam(event.target.files[0].name)
                }
            },

        });
    };


    // Define the handleCancel function
    const handleEditCancel = () => {
        // Set the modal visibility to false
        setVisible(false);
        setSelectedPlayer(null)
        setEditPopUpModal(false)
        // Reset the form fields
        form.resetFields();
    };
    // Handling Impport File Okay
    const handlePopUpOk = () => {
        let teamData = {
            data: players,
            fileName: team
        }
        dispatch(addTeam(teamData))
        setMainPlayersData(teamData.data)
        // setPlayers(teamData.data)
        setImportPopUp(false)
    }
    // Define the upload props for the import team button

    useEffect(() => {
        setPlayers(players) // should show the updated values
    });


    const handleDeletePlayer = () => {
        let afterDeletedData = mainPlayersData && mainPlayersData.filter((player) => player['Player Name'] !== selectedPlayer['Player Name']);
        //    After Deleting The Player Dispatching The Player To Redux Store
        dispatch(updatePlayerData(afterDeletedData))
        setConfirmDelete(false)
        setSelectedPlayer(false)
    }
    const handleEditPlayer = () => {

    }


    // Define the columns for the table



    return (
        <Layout>
            <Sider
                theme="dark"
                width="64px"
                style={{
                    overflow: "auto",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                }}
            >
                <div className="flex flex-col items-center justify-start h-full">
                    <div className="h-16 w-full flex items-center justify-center">
                        <img src={logo} alt="logo" className="h-8 w-8" />
                    </div>
                    <div className="space-y-6">
                        <NavLink to='/'><MdMenu className={`h-7 w-7 ${page == 1 ? 'text-yellow-400' : 'text-white'} `} /></NavLink>
                        <NavLink to='/preview' ><MdGroups className="h-7 w-7 text-white" /></NavLink>
                    </div>
                </div>
            </Sider>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgBase: '#2D2D2D',
                        colorText: 'white'
                    }
                }}
            >
                <Modal
                    title="Edit File Name"
                    open={editFileNamePopUp}
                    onOk={handleEditFileNameOk}
                    onCancel={handleEditFileNameCancel}
                    // Set the ok button style to orange
                    okButtonProps={{ style: { backgroundColor: "orange", borderColor: "orange" } }}
                >
                    <Input className="text-white" value={tempFileName} onChange={(e) => setTempFileName(e.target.value)} placeholder="Enter File Name" />
                </Modal>
            </ConfigProvider>
            <Layout className="ml-16 bg-gray-800 h-screen">
                <Header
                    className="bg-gray-800 shadow-sm flex items-center justify-between px-4 py-2"
                    style={{ zIndex: 1 }}
                >
                    <div className="items-center">
                        <div className="text-2xl font-bold text-white">Team Name</div>
                        <div className="ml-4 flex items-center">
                            <div className="text-lg font-medium text-white">{team || "My Team"}</div>
                            <EditOutlined className={`${team != 'My Team' ? '' : 'invisible'} ml-2 text-white`} onClick={() => setEditFileNamePopUp(true)} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <ConfigProvider
                            theme={
                                {

                                }
                            }>
                            <Input
                                style={{
                                    color: 'white'
                                }}
                                placeholder="Search Players"
                                color='white'
                                onKeyDown={handleKeyDown}
                                value={searchValue}
                                onChange={handleSearch}
                                prefix={<SearchOutlined className="text-black" />}
                                className="rounded-md text-black bg-white"
                            />
                        </ConfigProvider>


                        <Button
                            type="primary"
                            onClick={() => setImportPopUp(true)}
                            style={{ fontFamily: 'sans-serif', height: '35px', width: '120px', backgroundColor: 'orange', fontFamily: 'sans-serif' }}
                        >
                            Import Team
                        </Button>



                    </div>
                </Header>
                {/* Import PopUp Modal */}

                {importPopUp && (
                    <ConfigProvider
                        theme={{
                            token: {
                                colorBgContainer: '#2D2D2D',
                                colorBgBase: '#2D2D2D',
                                colorText: 'white'
                            }
                        }}
                    >
                        <Modal
                            className="w-[60rem]"
                            title="Importer"
                            open={importPopUp}
                            onOk={handlePopUpOk}
                            onCancel={handleImportCancel}
                            footer={null} // This will remove the default buttons
                        // okButtonProps={{ disabled: players.length === 0 }}
                        >
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                                ref={fileInputRef}
                            />
                            <div className="flex items-center justify-left border-[2px] border-black rounded-md w-fit">
                                <div className="flex items-center justify-center ">
                                    <div style={{ fontFamily: 'monospace' }} className="px-4 py-2 ">
                                        {isMissingField && <p className="text-red-500">There is missing field</p>}
                                        {!isMissingField && <p>{`${team === 'My Team' ? 'Not Choose Any Team' : team}`}</p>}
                                    </div>
                                </div>
                                <Button
                                    type="primary"
                                    onClick={() => fileInputRef.current.click()}
                                    style={{
                                        fontFamily: "sans-serif",
                                        height: "35px",
                                        width: "120px",
                                        backgroundColor: "orange",
                                        marginBottom: "2px",

                                    }}
                                >
                                    {`${mainPlayersData && mainPlayersData.length > 0 ? 'Re-import' : 'Import Team'}`}
                                </Button>
                            </div>
                            {isMissingField && <div>
                                <p className='text-red-600'>Error</p>
                                <p className="text-sm">Your sheet is missing data, Please ensure all cells are filled</p>
                            </div>}

                            <div style={{ fontFamily: 'monospace', }} className="text-start  text-[#FEA013] mt-1">File should be in csv format</div>
                            {!isMissingField && previewTableData && <div className="mt-4">
                                <Table dataSource={!isMissingField && previewTableData} columns={columnTwo} pagination={false} bordered={false} />
                            </div>}
                            <div className="flex justify-end m-3 space-x-3">
                                <Button onClick={handleImportCancel} className="bg-black text-white">
                                    Cancel
                                </Button>
                                {!isMissingField && players.length > 0 && (
                                    <Button onClick={handlePopUpOk} className={`bg-[#FEA013] text-white ${players.length > 0 && "disabled"}`}>
                                        Import
                                    </Button>
                                )}
                            </div>
                        </Modal>
                    </ConfigProvider>
                )}


                <Content
                    className="m-8 scrollbar-hide p-8 bg-gray-600 h-full rounded-lg overflow-auto"

                >
                    {mainPlayersData && mainPlayersData.length > 0 ? (
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorBgContainer: '#2D2D2D',
                                    colorText: 'white'
                                }
                            }}
                        >
                            <Table
                                theme='dark'
                                className="scrollbar-hide"
                                dataSource={mainPlayersData}
                                columns={[
                                    {
                                        title: '.',
                                        dataIndex: 'Flag Image',
                                        render: (_, player) => (
                                            <Image style={{ height: '2rem', width: '2.5rem' }} src={player['Flag Image']} />
                                        ),

                                    },
                                    ...columns,
                                    {
                                        title: 'Actions',
                                        dataIndex: 'actions',
                                        render: (_, player) => (
                                            <Button
                                                type="link"
                                                icon={<BsThreeDots onClick={() => setSelectedPlayer(player)} />}
                                                style={{ color: 'gray', marginRight: 8 }}
                                            />
                                        ),
                                    },
                                ]}
                                rowKey={(record) => Object.values(record).join('_')}
                                bordered={false}

                                onRow={(record) => ({
                                    onClick: () => setSelectedPlayer(record),

                                })}
                            />
                        </ConfigProvider>
                    ) : (
                        // Display a message if no team is selected
                        <div style={{ fontFamily: 'serif' }} className="text-lg font-medium cursor-pointer  text-white flex flex-col items-center justify-center h-full">
                            <h3
                                className="blo">You have not selected any Team</h3>
                            <h5 onClick={() => setImportPopUp(true)} style={{ fontFamily: 'revert' }} className="text-yellow-500 hover:text-yellow-600">Import</h5>
                        </div>)}

                    {/* Action Want to perform to a player */}
                    {selectedPlayer && (
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorBgBase: '#2D2D2D',
                                    colorText: 'white'
                                }
                            }}
                        >
                            <Modal
                                theme='dark'
                                className="width-[80%]"
                                title="Action"
                                open={selectedPlayer}
                                onCancel={() => setSelectedPlayer(null)}
                                footer={[
                                    <div className="items-center space-y-3 justify-center">
                                        <div
                                            className="flex w-fit cursor-pointer items-center text-white px-4 hover:text-red-500 py-2 rounded-md "
                                            key="delete"
                                            onClick={() => setConfirmDelete(true)}
                                        >
                                            <RiDeleteBinLine className="mr-2" />
                                            Delete Player
                                        </div>
                                        <div
                                            className="flex hover:text-orange-500 w-fit cursor-pointer items-center text-white px-4 py-2 rounded-md"
                                            key="edit"
                                            onClick={() => setEditPopUpModal(true)}
                                        >
                                            <RiEditLine className="mr-2" />
                                            Edit Player
                                        </div>
                                    </div>
                                ]}
                            >
                                <p className="font-bold">Edit and Delete options for {selectedPlayer['Player Name']}</p>
                            </Modal>
                        </ConfigProvider>
                    )}
                    {/* Edit Player Modal */}
                    {editPopUpModal && (
                        <>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorBgBase: '#2D2D2D',
                                        colorText: 'white'
                                    }
                                }}
                            >
                                <Modal
                                    title="Edit Player"
                                    open={editPopUpModal}
                                    onOk={handleEditOk}
                                    onCancel={handleEditCancel}
                                    okText="Edit"
                                    cancelText="Cancel"
                                // footer={null}
                                >
                                    <Form form={form} layout="vertical">
                                        <Form.Item
                                            label="Player Name"
                                            name="playerName"
                                            rules={[{ required: true, message: "Please enter the player name" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Jersey Number"
                                            name="jerseyNumber"
                                            rules={[
                                                { required: true, message: "Please enter the jersey number" },
                                                { type: "number", min: 1, max: 99, message: "Please enter a valid number between 1 and 99" },
                                            ]}
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                        <Form.Item
                                            label="Height"
                                            name="height"
                                            rules={[{ required: true, message: "Please enter the height" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Weight"
                                            name="weight"
                                            rules={[{ required: true, message: "Please enter the weight" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Nationality"
                                            name="nationality"
                                            rules={[{ required: true, message: "Please select the nationality" }]}
                                        >
                                            <Select options={nationalityOptions} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Position"
                                            name="position"
                                            rules={[{ required: true, message: "Please select the position" }]}
                                        >
                                            <Select options={positionOptions} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Starter"
                                            name="starter"
                                            rules={[{ required: true, message: "Please choose yes or no" }]}
                                        >
                                            <Radio.Group options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </ConfigProvider>
                        </>)
                    }
                    {/* Deleting The Player */}
                    {
                        confirmDelete && (
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorBgBase: '#2D2D2D',
                                        colorText: 'white'
                                    }
                                }}
                            >
                                <Modal
                                    className="absolute top-36 left-44"
                                    title={`Delete ${selectedPlayer['Player Name']}`}
                                    open={!!selectedPlayer}
                                    onCancel={() => setConfirmDelete(false)}
                                    footer={[
                                        <div className="flex items-center justify-center">
                                            <Button
                                                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md mr-4"
                                                key="delete"
                                                onClick={handleDeletePlayer}
                                            >
                                                <RiDeleteBinLine className="mr-2" />
                                                Delete Player
                                            </Button>
                                            <Button
                                                className="flex items-center bg-black text-white px-4 py-2 rounded-md mr-4"
                                                key="delete"
                                                onClick={() => setConfirmDelete(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    ]}
                                >
                                    <p>Are You Sure To Delete {selectedPlayer['Player Name']}</p>
                                </Modal>
                            </ConfigProvider>
                        )
                    }



                </Content>

            </Layout >
        </Layout >
    );
}

export default Home;
