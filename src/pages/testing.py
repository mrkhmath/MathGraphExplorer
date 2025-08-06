concept_options = []

with open("C:/Users/kh_ma/Documents/ccss-frontend/src/pages/ccss_ML_sandbox.csv", "r", encoding="utf-8") as file:
    for line in file:
        code = line.strip()
        if code:
            concept_options.append(code)

# Print as JS array
print("const conceptOptions = [")
for option in concept_options:
    print(f'  "{option}",')
print("];")
