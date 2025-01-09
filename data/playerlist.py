from re import A
import pandas as pd

allstar = pd.read_csv('allstar.csv')
allnba = pd.read_csv('allnba1.csv')
dpoy = pd.read_csv('dpoy.csv')
mvp = pd.read_csv('mvp.csv')
roty = pd.read_csv('roty.csv')
fmvp = pd.read_csv('fmvp.csv')
sixman = pd.read_csv('sixman.csv')
draftYear = pd.read_csv('draftyear.csv')
player_data = dict(zip(allstar["Player"], allstar["times"]))
player_datadraft = dict(zip(draftYear["Name"], draftYear["DraftYear"]))
#list all player names and the number of times they have won each award
def player_list():
    allstar_list = pd.Series(player_data)
    allnba_list = allnba['Player'].value_counts()
    dpoy_list = dpoy['Player'].value_counts()
    mvp_list = mvp['Player'].value_counts()
    roty_list = roty['Player'].value_counts()
    fmvp_list = fmvp['Player'].value_counts()
    sixman_list = sixman['Player'].value_counts() 
    draftyear_list = pd.Series(player_datadraft)

    player_list = pd.concat([allstar_list, dpoy_list, mvp_list, roty_list, fmvp_list, sixman_list, allnba_list,draftyear_list], axis=1)
    #fill nan with 0
    player_list = player_list.fillna(0)

    player_list.columns = ['All-Star', 'DPOY', 'MVP', 'ROTY', 'FMVP', 'Six-Man',"All-NBA","Draft-Year"]
    #make json
    player_list.to_csv('player_list.csv')
    
    return player_list

#make csv file
player_list()
