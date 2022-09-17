import './time-availablity.css';
import Select from 'react-select';
import { useEffect, useMemo, useState } from 'react';


const getTimeRanges = (min, max, steps) => {
    let times = [];
    for (var d = new Date(min); d <= new Date(max); d.setMinutes(d.getMinutes() + steps)) {
        times.push(new Date(d).toString().split(' ')[4].toString().split(':').slice(-3,-1).join(':'));
    }

    return times;
}

const TimeAvailablity = ({ min="1/1/1970 00:00", max = "1/1/1970 23:30", steps = 30, onDataUpdate = (data) => data }) =>{
    const [minTime, setMinTime] = useState(min);
    const [maxTime, setMaxTime] = useState('');
    const [times, setTimes] = useState([]);
    const [ weeksTimeFrame, setWeeksTimeFrame] = useState([
        { week: "Sunday", frames: [{ id: new Date().getTime(), start_time:"00:00", end_time:"00:00"}], isChecked: false },
        { week: "Monday", frames: [{ id: new Date().getTime(), start_time:"00:00", end_time:"00:00"}], isChecked: false },
        { week: "Tueday", frames: [{ id: new Date().getTime(), start_time:"00:00", end_time:"00:00"}], isChecked: false },
        { week: "Wednesday", frames: [{ id: new Date().getTime(), start_time:"00:00", end_time:"00:00"}], isChecked: false },
        { week: "Thursday", frames: [{ id: new Date().getTime(), start_time:"00:00", end_time:"00:00"}], isChecked: false },
        { week: "Friday", frames: [{ id: new Date().getTime(), start_time:"00:00", end_time:"00:00"}], isChecked: false },
        { week: "Saturday", frames: [{ id: new Date().getTime(), start_time:"00:00", end_time:"00:00"}], isChecked: false }
    ]);
    const timeRanges = useMemo(() => getTimeRanges(minTime, max, 30), [minTime, max]);

    useEffect(() =>{
        setTimes(timeRanges.map(time => ({value:time, label:time})));
    },[timeRanges])

    const handleWeekChecked = ( week ) => {
        const newWeeksTimeFrames = weeksTimeFrame.map( oldFrame =>{
            if( oldFrame.week === week.week ){
                return {...oldFrame, isChecked: true}
            }

            return oldFrame;
        })
        setWeeksTimeFrame(newWeeksTimeFrames);
        setMinTime("1/1/1970 00:00");
        onDataUpdate(newWeeksTimeFrames);
    }

    const handleMinTime = ({ value }, week, frame_id) =>{
        const newWeeksTimeFrames = weeksTimeFrame.map( oldFrame => {
            if( oldFrame.week === week ){
                const updatedFramed = oldFrame.frames.map( frame => {
                    if( frame.id === frame_id ){
                        return {...frame, start_time:value}
                    }

                    return frame;
                })

                return { ...oldFrame, frames:updatedFramed}
            }

            return oldFrame;
        })

        
        setWeeksTimeFrame(newWeeksTimeFrames);
        setMinTime("1/1/1970 "+value);
        onDataUpdate(newWeeksTimeFrames);
    }

    const handleMaxTime = ( { value }, week, frame_id ) =>{
        const newWeeksTimeFrames = weeksTimeFrame.map( oldFrame => {
            if( oldFrame.week === week ){
                const updatedFramed = oldFrame.frames.map( frame => {
                    if( frame.id === frame_id ){
                        return {...frame, end_time:value}
                    }

                    return frame;
                })

                return { ...oldFrame, frames:updatedFramed}
            }

            return oldFrame;
        })
        
        setWeeksTimeFrame(newWeeksTimeFrames);
        setMaxTime("1/1/1970 "+value);
        onDataUpdate(newWeeksTimeFrames);
    }

    const handleTimeBoxAdd = (week) =>{
        const newWeeksTimeFrames = weeksTimeFrame.map( oldFrame => {
            if( oldFrame.week === week.week ){
                return {...oldFrame, frames:[...oldFrame.frames, { id: new Date().getTime(), start_time:"00:00", end_time:"00:00"}]}
            }

            return oldFrame;
        })

        setWeeksTimeFrame(newWeeksTimeFrames);
        setMinTime(maxTime);
        onDataUpdate(newWeeksTimeFrames);
    }

    const deleteTimeBox = ( week, frame_id ) =>{
        const newWeeksTimeFrames = weeksTimeFrame.map( oldWeekFrame => {
            if( oldWeekFrame.week === week.week ){
                return {...oldWeekFrame, frames: oldWeekFrame.frames.filter( frame => frame.id !== frame_id )}
            }

            return oldWeekFrame;
        })

        setWeeksTimeFrame(newWeeksTimeFrames);
        setMinTime(maxTime);
        onDataUpdate(newWeeksTimeFrames);
    }

    return (
        <div className="set-avaiablity">
            {
                weeksTimeFrame.map( week => (
                    <div className="mb-4" key={week.week}>
                        <div className="time-frame">
                            <div className="day">
                                <input type="checkbox" name="day" id="day" onChange={ () => handleWeekChecked(week) }/>
                                <label htmlFor="day" className="mb-0">{ week.week }</label>
                            </div>
                    
                            { week.isChecked && week.frames.map( ( value ) => (
                                week.frames.length > 1 ? 
                                <div className="schedule-box" key={value.id}>
                                    <Select 
                                        options={times}
                                        isSearchable={false} 
                                        placeholder="00:00" 
                                        onChange={ event => handleMinTime(event, week.week, value.id) }/>
                                    <span className="helper">to</span>
                                    <Select 
                                        options={times}
                                        isSearchable={false} 
                                        placeholder="00:00" 
                                        onChange={ event => handleMaxTime(event, week.week, value.id) }/>
                                     
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='helper' width="15" height="15" onClick={() => deleteTimeBox(week,value.id)}><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='helper' width="15" height="15" onClick={()=> handleTimeBoxAdd(week) }><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                </div>
                                :
                                <div className="schedule-box" key={value.id}>
                                    <Select 
                                        options={times}
                                        isSearchable={false} 
                                        placeholder="00:00" 
                                        onChange={ event => handleMinTime(event, week.week, value.id) }/>
                                    <span className="helper">to</span>
                                    <Select 
                                        options={times}
                                        isSearchable={false} 
                                        placeholder="00:00" 
                                        onChange={ event => handleMaxTime(event, week.week, value.id) }/>
                                     
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='helper' width="15" height="15" onClick={()=> handleTimeBoxAdd(week) }><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                </div>
                            )) }
                        </div>
                    </div>
                ))
            }
            
        </div>
    )
}

export default TimeAvailablity;