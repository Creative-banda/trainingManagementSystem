import enum

@enum.unique
class TrainingStatusEnum(enum.Enum):
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    PENDING = "PENDING"
    TRANSFERRED = "TRANSFERRED"

    @classmethod
    def choices(cls):
        return [(x.value, x.name) for x in cls]
    
@enum.unique
class TrainingTypeEnum(enum.Enum):
    ROBOTICS = "ROBOTICS"
    COMPUTER_SCIENCE = "COMPUTER SCIENCE"
    AEROMOELLING = "AEROMODELLING"
    DOUBT_SESSION = "DOUBT SESSION"

    @classmethod
    def choices(cls):
        return [(e.value, e.name) for e in cls]


@enum.unique
class TrainingRequestEnum(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"

    @classmethod
    def choices(cls):
        return [(x.value, x.name) for x in cls]

@enum.unique
class TeacherAttendanceEnum(enum.Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    LEAVE = "LEAVE"

    @classmethod
    def choices(cls):
        return [(x.value, x.name) for x in cls]