import enum

@enum.unique
class CatagoryEnum(enum.Enum):
    CATAGORYA = 'CATAGORY A'
    CATAGORYB = 'CATAGORY B'
    CATAGORYC = 'CATAGORY C'
    CATAGORYD = 'CATAGORY D'
    
    @classmethod
    def choices(cls):
        return [(cls.value, cls.name) for cls in cls]