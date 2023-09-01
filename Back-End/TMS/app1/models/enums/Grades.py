import enum

@enum.unique
class Grade(enum.Enum):
    Grade1 = 'Grade1'
    Grade2 = 'Grade2'
    Grade3 = 'Grade3'
    Grade4 = 'Grade4'
    Grade5 = 'Grade5'
    Grade6 = 'Grade6'
    Grade7 = 'Grade7'
    Grade8 = 'Grade8'
    Grade9 = 'Grade9'
    Grade10 = 'Grade10'
    Grade11 = 'Grade11'
    Grade12 = 'Grade12'

    @classmethod
    def choices(cls):
        return [(grade.value, grade.name) for grade in cls]
    