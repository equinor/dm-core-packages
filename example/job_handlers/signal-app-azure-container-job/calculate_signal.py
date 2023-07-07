from time import sleep

print("Starting to calculate signal")
sleep(5)
repeat_count = 20
signal_part = [1, -1, 1, -1]
final_signal = []

for i in range(repeat_count):
    final_signal += signal_part
    sleep(0.1)

print("completed signal generation!")
print(final_signal)
