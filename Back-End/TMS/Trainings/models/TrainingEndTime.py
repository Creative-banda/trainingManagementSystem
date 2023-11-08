import enum

@enum.unique
class EndTime(enum.Enum):
    NINE_THIRTY = "09:30:00"
    ELEVEN_THIRTY = "11:30:00"
    ONE_THIRTY = "01:30:00"
    FOUR = "04:00:00"
    SIX_THIRTY = "06:30:00"

    @classmethod
    def choices(cls):
        return [(choice.value, choice.value) for choice in cls]