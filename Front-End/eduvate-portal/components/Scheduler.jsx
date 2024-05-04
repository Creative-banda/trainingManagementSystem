// import React, { useEffect, useMemo, useState } from 'react'
// import useFilterTraining from '../hooks/filter_training'

// const time = ["", "08:00", "10:00", "12:00", "14:00"]

// class Trainers {
//     constructor (trainingId, trainerName, training) {
//         this.trainingId = trainingId
//         this.trainerName = trainerName
//         this.startTime = training.startTime
//         this.endTime = training.endTime
//     }

//     getStartTime () {
//         return this.startTime
//     }
// }


// const trainer_and_school = [
//     {
//         id: 1,
//         trainerName: "Trainer 1",
//         schools: [
//             {
//                 id: 1,
//                 name: "School 1"
//             },
//             {
//                 id: 2,
//                 name: "School 2"
//             },
//             {
//                 id: 3,
//             },
//             {
//                 id: 4,
//                 name: "School 3"
//             },
//         ]
//     },
//     {
//         id: 2,
//         trainerName: "Trainer 2",
//         schools: [
//             {
//                 id: 1,
//                 name: "School 1"
//             },
//             {
//                 id: 2,
//             },
//             {
//                 id: 3,
//                 name: "School 2"
//             },
//             {
//                 id: 4,
//             },
//         ]
//     },
//     {
//         id: 3,
//         trainerName: "Trainer 3",
//         schools: [
//             {
//                 id: 1,
//                 name: "School 1"
//             },
//             {
//                 id: 2,
//                 name: "School 2"
//             },
//             {
//                 id: 3,
//             },
//             {
//                 id: 4,
//                 name: "School 3"
//             },
//         ]
//     },
//     {
//         id: 4,
//         trainerName: "Trainer 3",
//         schools: [
//             {
//                 id: 1,
//                 name: "School 1"
//             },
//             {
//                 id: 2,
//                 name: "School 2"
//             },
//             {
//                 id: 3,
//             },
//             {
//                 id: 4,
//                 name: "School 3"
//             },
//         ]
//     },
// ]

// function Scheduler() {
//     const {loadingTrainings, training} = useFilterTraining();
//     const [scheduleData, setScheduleData] = useState({});

//     useMemo(() => {
//         const schedule = {}
//         training?.forEach(training => {
//             if (schedule[training.trainers[0].username]) {
//                 schedule[training.trainers[0].username].push({
//                     startTime: training.startTime,
//                     endTime: training.endTime,
//                     schools: training.schools.map(school => school.name),
//                     status: training.trainingStatus
//                 })
//             }
//             else {
//                 schedule[training.trainers[0].username] = [{
//                     startTime: training.startTime,
//                     endTime: training.endTime,
//                     schools: training.schools.map(school => school.name),
//                     status: training.trainingStatus
//                 }]
//             }
//         })

//         setScheduleData(schedule);

//     }, [training])

//     console.log(scheduleData);


//     return (

//         <div className='w-full h-full'>
//             <div className='flex flex-col'>
//                 <div className='flex'>
//                     <div className='w-full bg-teal-500'></div>
//                     {
//                         time.map((time, index) => (
//                             <div key={index} className='w-full bg-teal-700 text-white'>{time}</div>
//                         ))
//                     }
//                 </div>
//                 {
//                     scheduleData && Object.keys(scheduleData).map((trainer, index) => (
//                         <div className='flex' key={index}>
//                             <div className='w-full border'>{trainer}</div>
//                             {
//                                 scheduleData[trainer].map((training, index) => (
//                                     <div className='w-full border' key={index}> {training?.schools?.map(school => school)} </div>
//                                 ))
//                             }
//                         </div>
//                     ))
//                 }
//             </div>
            
//         </div>
//     )
// }

// export default Scheduler

import React from 'react';

const trainers = ["Trainer A", "Trainer B", "Trainer C"]; // Example list of trainers

const trainingData = [
  { trainer: "Trainer A", time: "9:00 AM", details: "Training 1" },
  { trainer: "Trainer B", time: "9:00 AM", details: "Training 2" },
  { trainer: "Trainer C", time: "9:00 AM", details: "Training 3" },
  { trainer: "Trainer A", time: "10:00 AM", details: "Training 4" },
  { trainer: "Trainer B", time: "10:00 AM", details: "Training 5" },
  { trainer: "Trainer A", time: "11:00 AM", details: "Training 6" },
  { trainer: "Trainer C", time: "11:00 AM", details: "Training 7" },
  {trainer: "Trainer B", time: "09:00 AM", details: "Training 8"},
  // Add more training data as needed
];


const TrainingSchedule = () => {
  // Extract unique times from trainingData
  const times = [...new Set(trainingData.map(training => training.time))];

  return (
    <div className='w-fll'>
      <table className='w-full table border-collapse'>
        <thead>
          <tr className='border'>
            <th></th> {/* Placeholder for top-left corner */}
            {times.map(time => (
              <th key={time}>{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trainers.map(trainer => (
            <tr key={trainer} className='border'>
              <td>{trainer}</td>
              {times.map(time => {
                const trainings = trainingData.filter(training => training.trainer === trainer && training.time === time);
                const mergedText = trainings.map(training => training.details).join(' / ');
                return (
                  <td key={`${trainer}-${time}`}>{mergedText}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingSchedule;
