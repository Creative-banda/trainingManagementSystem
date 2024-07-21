import enum

@enum.unique
class SubjectEnum(enum.Enum):
    ENGLISH = 'ENGLISH'
    MATH = 'MATH'
    PHYSICS = 'PHYSICS'
    CHEMISTRY = 'CHEMISTRY'
    BIOLOGY = 'BIOLOGY'
    CS = 'COMPUTER SCIENCE'
    ROBOTICS = 'ROBOTICS'
    SCIENCE = 'SCIENCE'

    @classmethod
    def choices(cls):
        return [(cls.value, cls.name) for cls in cls]