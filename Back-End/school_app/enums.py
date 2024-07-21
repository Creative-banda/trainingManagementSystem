import enum

@enum.unique
class CatagoryEnum(enum.Enum):
    CATAGORYA = 'CATAGORY A'
    CATAGORYB = 'CATAGORY B'
    CATAGORYC = 'CATAGORY C'
    CATAGORYD = 'CATAGORY D'
    CATAGORYE = 'CATAGORY E'
    
    @classmethod
    def choices(cls):
        return [(cls.value, cls.name) for cls in cls]


@enum.unique
class GradeEnum(enum.Enum):
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


@enum.unique
class TrainingStatusEnum(enum.Enum):
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    PENDING = "PENDING"

    @classmethod
    def choices(cls):
        return [(x.value, x.name) for x in cls]