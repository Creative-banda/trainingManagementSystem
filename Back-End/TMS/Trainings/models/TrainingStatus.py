import enum

@enum.unique
class TrainingStatus(enum.Enum):
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    PENDING = "PENDING"

    @classmethod
    def choices(cls):
        return [(x.value, x.name) for x in cls]
    
    