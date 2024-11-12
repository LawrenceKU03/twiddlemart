from datetime import datetime

d1 = str(datetime.now())[10:].replace(":", "")

for _ in range(200000000):
    pass
d2 = str(datetime.now())[10:].replace(":", "")
print(d1, d1, int(d2[:6])-int(d1[:6]))
