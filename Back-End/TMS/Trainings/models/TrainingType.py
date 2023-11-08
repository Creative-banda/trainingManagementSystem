import enum

@enum.unique
class TrainingType(enum.Enum):
    ROBOTICS = "ROBOTICS"
    COMPUTER_SCIENCE = "COMPUTER_SCIENCE"

    @classmethod
    def choices(cls):
        return [(e.value, e.name) for e in cls]