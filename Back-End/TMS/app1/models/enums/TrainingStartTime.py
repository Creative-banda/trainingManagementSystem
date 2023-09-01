import enum

@enum.unique
class StartTime(enum.Enum):
    EIGHT = "08:00:00"
    TEN = "10:00:00"
    TWELVE = "12:00:00"
    TWO = "14:00:00"
    FOUR = "16:00:00"

    @classmethod
    def choices(cls):
        return [(choice.value, choice.value) for choice in cls]

