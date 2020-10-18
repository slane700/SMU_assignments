import csv
import statistics

csvpath = r"Resources/budget_data.csv"

#master = []
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

        # if first row, do nothing, but set lastRowProfit
        #otherwise, get the change
        #row - last row profit
        # add to dictionary with month as the key
        # update last row profit
        #continue loop

for key in changeDict.keys():
    averageChange = (sum(changeDict.values())) / (totalMonths-1)

maxChange = max(changeDict,key=changeDict.get)
minChange = min(changeDict, key=changeDict.get)

print(totalMonths)
print(profitLosses)
print(changeDict)
print(averageChange)
print(maxChange)
print(minChange)

summary = f""" Financial Analysis 
---------------------------------
Total Months : {totalMonths}
Total: ${profitLosses}
Average Change: %{averageChange}
Greatest Increase in Profits: {maxChange}
Greatest Decrease in Profits: {minChange}"""

print(summary)




            


            
