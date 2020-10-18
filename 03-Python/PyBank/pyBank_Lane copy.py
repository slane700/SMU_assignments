import csv

csvpath = r"Resources/budget_data.csv"

totalMonths = 0 
profitLosses = 0 
lastMonthProfit = 0 
firstRow = True
changeDict = {}

with open(csvpath, "r") as csvfile: 
    csvreader = csv.reader(csvfile, delimiter = ',')

    csv_header = next(csvreader)
    print(f"CSV Header: {csv_header}")
    
    for row in csvreader:
        totalMonths += 1 
        profitLosses += int(row[1])
        
        if firstRow: 
             lastMonthProfit = row[1] 
             firstRow = False
        else: 
            change = int(row[1]) - int(lastMonthProfit)
            changeDict[row[0]] = change 
            lastMonthProfit = int(row[1])

for key in changeDict.keys():
    averageChange = (sum(changeDict.values())) / (totalMonths-1)

maxChange = max(changeDict,key=changeDict.get)
maxChangeValue = changeDict[maxChange]
minChange = min(changeDict, key=changeDict.get)
minChangeValue = changeDict[minChange]

#print(totalMonths)
#print(profitLosses)
#print(changeDict)
#print(averageChange)
#print(maxChange)
#print(minChange)


summary = f""" Financial Analysis 
---------------------------------
Total Months : {totalMonths}
Total: ${profitLosses}
Average Change: %{averageChange}
Greatest Increase in Profits: {maxChange}(${maxChangeValue})
Greatest Decrease in Profits: {minChange}(${minChangeValue})"""

print(summary)

with open("Financial_AnalysisResults.txt", "w") as file1:
    file1.write(summary)




            


            
