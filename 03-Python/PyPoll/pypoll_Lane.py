import csv

csvpath = r"PyPoll/Resources/election_data.csv"

totalVotes = 0 

candidateDict = {}

with open(csvpath, "r") as csvfile: 
    csvreader = csv.reader(csvfile, delimiter = ',')

    csv_header = next(csvreader)
    print(f"CSV Header: {csv_header}")
    #determining total votes 
    for row in csvreader:
        totalVotes += 1
    
        #row[0] = Voter ID
        #row[1] = Couty
        #row[2] = Candidate 
    
        candidate = row[2]
        if candidate in candidateDict.keys():
            candidateDict[candidate] += 1
        else: 
            candidateDict[candidate] = 1

winner = max(candidateDict, key=candidateDict.get)

#determinging percent 
percentDict = {}
for key in candidateDict.keys():
    percent = candidateDict[key] / totalVotes
    percentDict[key] = percent

print(percentDict)     
    
#list of strings for each candiate 
stringList = []
for key in percentDict.keys():
    finalString = key + ": " + str(round(percentDict[key]* 100, 3))+ "% (" + str(candidateDict[key]) + ")"
    stringList.append(finalString)

print(stringList)

endString = "\n".join(stringList)

endResult = f"""Election Results 
-----------------------------
Total Votes : {totalVotes}
_____________________________
{endString}
______________________________
Winner: {winner}
______________________________"""

print(endResult)

with open("results.txt", "w") as file1:
    file1.write(endResult)

            


            
