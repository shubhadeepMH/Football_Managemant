import React, { useEffect, useState } from 'react'
import { Layout, Menu, Input, Button, Upload, Table, Popconfirm, Dropdown, message, Modal, Select, Radio, InputNumber, Form } from "antd";
import { RiDeleteBinLine, RiEditLine } from "react-icons/ri"
import { MdMenu, MdGroups, MdTrendingUp } from "react-icons/md";
import { SearchOutlined, EditOutlined, UploadOutlined, ExclamationCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { NavLink } from 'react-router-dom';
import logo from '../assets/footballLogo.png'
import { useDispatch, useSelector } from 'react-redux';
import footballGround from '../assets/FootballGround.jpg'
import TeamReviewPopUp from '../Components/TeamReviewPopUp';
import alertData from '../Datas/AlertDatas';

const { Sider, Header, Content } = Layout;



const Previewpage = () => {
    const [team, setTeam] = useState("My Team")
    const [players, setPlayers] = useState([]);
    const [starter, setStarter] = useState()
    const [starterData, setStarterData] = useState([])
    const [alertDataNum, setAlertDataNum] = useState()
    const [goalKeeper, setGoalKeeper] = useState()
    const [defender, setDefender] = useState()
    const [midFielder, setMidFielder] = useState()
    const [forward, setForward] = useState()
    const [page, setPage] = useState(2)
    const [selectedPlayerPreview, setSelectedPlayerPreview] = useState()
    let dispatch = useDispatch()

    let storeData = useSelector((state) => state.TeamSlice)
    // Finding number of Starter data
    const getStarterNum = () => {
        const numberOfStarters = players && players.filter(player => player.Starter === 'Yes').length;
        setStarter(numberOfStarters)
    }
    // Finding number of starter data
    const getStarterData = () => {
        let res = players && players.filter((player) => player.Starter === 'Yes')
        setStarterData(res)
    }
    // Splitting The Starter Array According to Their Positions
    const splitStarterForPosotions = () => {
        const goalkeepers = starterData && starterData.filter((player) => player["Position"] === 'Goalkeeper');
        const defenders = starterData && starterData.filter((player) => player["Position"] === 'Defender');
        const midfielders = starterData && starterData.filter((player) => player["Position"] === 'Midfielder');
        const forwards = starterData && starterData.filter((player) => player["Position"] === 'Forward');
        setGoalKeeper(goalkeepers)
        setDefender(defenders)
        setMidFielder(midfielders)
        setForward(forwards)
    }

    // Updating Some Data in UseEffect
    useEffect(() => {
        setPlayers(storeData.data)
        setTeam(storeData.fileName)
    },[storeData.data,storeData.fileName])

    useEffect(()=>{
        getStarterNum()
        getStarterData()
        splitStarterForPosotions()
    },[starter])



    useEffect(() => {
        if (starter < 11) {
            setAlertDataNum(0)
        }
        else if (starter > 11) {
            setAlertDataNum(1)
        } else {
            setAlertDataNum(2)
        }
    })
    

        // Finding GoalKeeper for By Default Player Preview
        const gettingGoalKeeperData=()=>{
            let res = starterData && starterData.length>0 && starterData.filter((player) => player['Position'] === 'Goalkeeper')[0]
            setSelectedPlayerPreview(res)
        }
        useEffect(()=>{
            gettingGoalKeeperData()
        },[starter])
       
    
    
   


    
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
                        <NavLink to='/'><MdMenu className="h-7 w-7 text-white" /></NavLink>
                        <NavLink to='/preview' ><MdGroups className={`h-7 w-7 ${page == 2 ? 'text-yellow-400' : 'text-white'} `} /></NavLink>
                    </div>
                </div>
            </Sider>
            <Layout className="ml-16 bg-gray-800 h-screen">
                <Header
                    className="bg-gray-800 shadow-sm flex items-center justify-between px-4 py-2"
                    style={{ zIndex: 1 }}
                >
                    <div className="items-center">
                        <div className="text-2xl font-bold text-white">Brand Name</div>
                        <div className="ml-4 flex items-center">
                            <div className="text-lg font-medium text-white">{team}</div>
                            {/* <EditOutlined className="ml-2 text-white" /> */}
                        </div>
                    </div>

                </Header>
                <Content
                    className="m-8 p-6 bg-gray-600 h-full rounded-lg overflow-auto"
                >
                    <div className="flex h-full gap-2 bg-gray  ">
                        <div style={{ backgroundImage: `url(${footballGround})`, }} className="w-3/4 bg-cover bg-center bg-no-repeat h-[100%] relative ">
                            <div className={`h-[100%] w-[100%] bg-gray-800 ${!players || alertDataNum <= 1 ? 'bg-opacity-40' : 'bg-opacity-0'}`}>
                                {/* Alert If Team Data not Found */}
                                {!players && <TeamReviewPopUp alertMessage={alertData[2].alertMessage} alertTitle={alertData[2].alertTitle} />}

                                {/* Alert If Starter Not Enough */}
                                {alertDataNum == 0 && <TeamReviewPopUp alertMessage={alertData[0].alertMessage} alertTitle={alertData[0].alertTitle} />}

                                {/* Alert If Starter Data More*/}
                                {alertDataNum == 1 && <TeamReviewPopUp alertMessage={alertData[1].alertMessage} alertTitle={alertData[1].alertTitle} />}
                            </div>
                            {/* Positioning Players On The Field */}
                            {players && starter == 11 && <div className=' justify-evenly flex absolute h-[100%] w-[100%] top-0 left-0'>
                                <div className='flex justify-center relative right-[4.5rem] items-center h-[100%] w-[2rem]'>
                                    {/* Goalkeeper */}
                                    {goalKeeper && goalKeeper.map((player,index) => {
                                        return (<div key={index} onClick={() => setSelectedPlayerPreview(player)} className={`h-7 w-7 ${selectedPlayerPreview && selectedPlayerPreview["Player Name"] == player["Player Name"] && 'h-8 w-8 bg-yellow-500 border-none'} cursor-pointer shadow-lg flex justify-center items-center bg-black border-white border-2 rounded-full`}>
                                            <div className='h-4 flex justify-center items-center w-4 rounded-full'><p className='font-bold text-white font-sans'>{player["Jersey Number"]}</p></div>
                                        </div>)
                                    })}
                                </div>
                                <div className='flex flex-col justify-evenly  relative right-[4.5rem] items-center  h-[100%] w-[2rem]'>
                                    {/* Defender */}
                                    {defender && defender.map((player,index) => {
                                        return (<div key={index} onClick={() => setSelectedPlayerPreview(player)} className={`h-7 w-7 ${selectedPlayerPreview && selectedPlayerPreview["Player Name"] == player["Player Name"] && 'h-8 w-8 bg-yellow-500 border-none'} cursor-pointer shadow-lg flex justify-center items-center bg-black border-white border-2 rounded-full`}>
                                            <div className='h-5 w-5 flex justify-center items-center  rounded-full'><p className='font-bold text-white font-sans'>{player["Jersey Number"]}</p></div>
                                        </div>)
                                    })}
                                </div>
                                <div className='flex flex-col justify-evenly relative right-[5rem] items-center  h-[100%] w-[2rem]'>
                                    {/* Midfielder */}
                                    {midFielder && midFielder.map((player,index) => {
                                        return (<div  key={index} onClick={() => setSelectedPlayerPreview(player)} className={`h-7 w-7 ${selectedPlayerPreview && selectedPlayerPreview["Player Name"] == player["Player Name"] && 'h-8 w-8 bg-yellow-500 border-none'} cursor-pointer shadow-lg flex justify-center items-center bg-black border-white border-2 rounded-full`}>
                                            <div className=' h-5 w-5 flex justify-center items-center  rounded-full'><p className='font-bold text-white font-sans'>{player["Jersey Number"]}</p></div>
                                        </div>)
                                    })}
                                </div>
                                <div className='flex flex-col cursor-pointer justify-evenly relative right-[4rem] items-center  h-[100%] w-[2rem]'>
                                    {/* Forward */}
                                    {forward && forward.map((player,index) => {
                                        return (<div key={index} onClick={() => setSelectedPlayerPreview(player)} className={`h-7 w-7 ${selectedPlayerPreview && selectedPlayerPreview["Player Name"] == player["Player Name"] && 'h-8 w-8 bg-yellow-500 border-none'} cursor-pointer shadow-lg flex justify-center items-center bg-black border-white border-2 rounded-full`}>
                                            <div className=' h-5 w-5 flex justify-center items-center  rounded-full'><p className='font-bold text-white font-sans'>{player["Jersey Number"]}</p></div>
                                        </div>)
                                    })}
                                </div>
                            </div>}
                        </div>
                        <div className="w-1/4 bg-gray-800 rounded-md">
                            {/* Preview Image Part */}
                            {players && starter == 11 && selectedPlayerPreview && <div className='h-[70%] border-gray-500 border-b-2 relative'>
                                <div><p className='text-[5rem] text-yellow-600 font-extrabold top-2 left-4 absolute'>{selectedPlayerPreview['Jersey Number']}</p></div>
                                {/* Top Image Container */}
                                <div>
                                    {/* Image */}
                                    {<img className='h-[70%]  absolute left-[3rem] top-[2rem] ' src={selectedPlayerPreview["Player Image"]} alt="Sory sir/mam image not found" />}
                                </div>
                                <div className='top-[12rem]   absolute left-3'>
                                    {/* Data  */}
                                    <div>
                                        {/* Name And Position */}
                                        <h2 className='font-extrabold text-xl text-white font-serif'>{selectedPlayerPreview["Player Name"]}</h2>
                                        <h3 style={{ fontFamily: 'monospace' }} className='font-bold text-lg  text-yellow-500'>{selectedPlayerPreview["Position"]}</h3>
                                    </div>

                                </div>
                                <div className='flex justify-between px-2 absolute bottom-1 space-x-4'>
                                    <div>
                                        <h3 style={{ fontFamily: 'sans-serif' }} className='text-gray-400 font-bold'>Height</h3>
                                        <p style={{ fontFamily: 'monospace' }} className='text-white font-bold'>{selectedPlayerPreview["Height"]}m</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: 'sans-serif' }} className='text-gray-400 '>Weight</h3>
                                        <p style={{ fontFamily: 'monospace' }} className='text-white font-bold'>{selectedPlayerPreview["Weight"]} kg</p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontFamily: 'sans-serif' }} className='text-gray-400'>Nationality</h3>
                                        <div className='flex justify-center gap-2 items-center'>
                                            <img className='h-5 w-5' src={selectedPlayerPreview["Flag Image"]} alt="" />
                                            <p style={{ fontFamily: 'monospace' }} className='text-white font-bold'>{selectedPlayerPreview["Nationality"]}</p>
                                        </div>
                                    </div>

                                </div>
                                <div></div>
                            </div>}
                            { players && starter==11 && selectedPlayerPreview && <div className='h-[30%]'>
                                {/* Bottom Data */}
                                <div className='w-[100%] h-[50%] flex space-x-6  px-4'>
                                    <div className='w-[50%]'>
                                        <h2 className='text-yellow-500 text-2xl'>{selectedPlayerPreview['Appearances']}</h2>
                                        <p style={{ fontFamily: 'monospace' }} className='text-gray-300 '>Appearances</p>
                                    </div>
                                    <div className='w-[50%]'>
                                        <h2 className='text-yellow-500 text-2xl'>{selectedPlayerPreview['Minutes Played']}</h2>
                                        <p style={{ fontFamily: 'monospace' }} className='text-gray-300 '>Minutes Played</p>
                                    </div>
                                </div>
                                <div className=' w-[100%] h-[50%] flex px-4 space-x-4'>
                                   {selectedPlayerPreview['Position']==='Goalkeeper'? (<div className='w-[50%]'>
                                        <h2 className='text-yellow-500 text-2xl'>{selectedPlayerPreview['Clean Sheets']}</h2>
                                        <p style={{ fontFamily: 'monospace' }} className='text-gray-300 '>Clean Sheets</p>
                                    </div>):(<div className='w-[50%]'>
                                        <h2 className='text-yellow-500 text-2xl'>{selectedPlayerPreview['Assists']}</h2>
                                        <p style={{ fontFamily: 'monospace' }} className='text-gray-300 '>Assists</p>
                                    </div>)}
                                    <div className='w-[50%]'>
                                        {selectedPlayerPreview["Position"] === "Goalkeeper" ? (<div>
                                            {/* If player is a Goalkeeper */}
                                            <h2 className='text-yellow-500 text-2xl'>{selectedPlayerPreview['Saves']}</h2>
                                            <p style={{ fontFamily: 'monospace' }} className='text-gray-300 '>Saves</p>
                                        </div>) : (
                                            <div>
                                                {/* If Player Is not A GoalKeeper */}
                                                <h2 className='text-yellow-500 text-2xl'>{selectedPlayerPreview['Goals ']}</h2>
                                                <p style={{ fontFamily: 'monospace' }} className='text-gray-300 '>Goals</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>}
                        </div>

                    </div>

                </Content>

            </Layout >
        </Layout >
    )
}

export default Previewpage
