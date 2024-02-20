import enum

@enum.unique
class TrainingStatusEnum(enum.Enum):
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    PENDING = "PENDING"

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