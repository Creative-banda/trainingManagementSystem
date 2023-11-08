import enum

@enum.unique
class UserType(enum.Enum):
    ADMIN = "ADMIN"
    TRAINER = "TRAINER"
    AM = "AM"
    OM = "OM"

    @classmethod
    def choices(cls):
        return [(e.value, e.value) for e in cls]