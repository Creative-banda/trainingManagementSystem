export const trainingSheetData = [
    {
        id: 1,
        grade: "Grade 1",
        topic: "Topic 1",
        date: "2022-01-01",
        duration: "1 hour",
        conducted: "Yes",
        trainerRemark: "Good"
        
    },
    {
        id: 2,
        grade: "Grade 2",
        topic: "Topic 2",
        date: "2022-01-02",
        duration: "2 hours",
        conducted: "No",
        trainerRemark: "Bad"
    },
    {
        id: 3,
        grade: "Grade 3",
        topic: "Chapter 1: Introduction",
        date: "2022-01-03",
        duration: "3 hours",
        conducted: "Yes",
        trainerRemark: "Teacher did not join the session on time and expected to explain each topic from scratch."
    }
]

export const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}