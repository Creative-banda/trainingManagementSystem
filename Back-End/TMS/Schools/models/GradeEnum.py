import enum

@enum.unique
class Grade(enum.Enum):
    Grade1 = 'Grade 1'
    Grade2 = 'Grade 2'
    Grade3 = 'Grade 3'
    Grade4 = 'Grade 4'
    Grade5 = 'Grade 5'
    Grade6 = 'Grade 6'
    Grade7 = 'Grade 7'
    Grade8 = 'Grade 8'
    Grade9 = 'Grade 9'
    Grade10 = 'Grade 10'
    Grade11 = 'Grade 11'
    Grade12 = 'Grade 12'

    @classmethod
    def choices(cls):
        return [(grade.value, grade.name) for grade in cls]