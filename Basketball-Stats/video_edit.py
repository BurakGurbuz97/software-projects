import cv2
import math
from moviepy.editor import ImageSequenceClip
import psycopg2 as driver

inp = input("Enter the match_id you want to edit: ")

try:
    conn = driver.connect("postgres://bxfqmiva:UTn8x6X1jpew3yFT3dCHmXnoe3nYnjge@isilo.db.elephantsql.com:5432/bxfqmiva")
except:
    print("I am unable to connect to the database")
    
    
cur = conn.cursor()
cur.execute("""SELECT   away_team_name,home_team_name, player_id,description, 
                time, current_home_score,current_away_score,home_action  
                FROM actions WHERE match_id = '{}'""".format(inp))
rows = cur.fetchall()
conn.close()
actions = []
for away, home,player, description, time, home_score, away_score,home_action in rows:
    actions.append({
        "away": away,
        "home": home,
        "player": player,
        "description": description,
        "time": time,
        "home_score": home_score,
        "away_score": away_score,
        "home_action": home_action
    })

#Read video
cap = cv2.VideoCapture('{}.mp4'.format(inp))
if (cap.isOpened()== False): 
  print("Error opening video stream or file")
FPS = cap.get(cv2.CAP_PROP_FPS)
WINDOW_SIZE_BACK = 5
WINDOW_SIZE_FORW = 5


def get_window_start_end(action_seconds, window_size_back = WINDOW_SIZE_BACK, window_size_forw= WINDOW_SIZE_FORW, fps = FPS):
    start = int(action_seconds * fps  - (window_size_back * fps))
    end = int(action_seconds * fps  + (window_size_forw * fps))
    return (start, end)

def add_description(frame, description):
    cv2.putText(frame, description, (10,40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 4, cv2.LINE_AA)
    return frame

def add_player(frame, player_name, team):
    text = "{} ({})".format(player_name, team)
    cv2.putText(frame, text, (10,frame.shape[0] - 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (200, 0, 100), 4, cv2.LINE_AA)
    return frame

def add_score(frame, home, away, home_score, away_score):
    text1 = "{}: {}".format(home, home_score)
    text2 = "{}: {}".format(away, away_score)
    cv2.putText(frame, text1, (frame.shape[1] - 200, frame.shape[0] - 50),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 100), 4, cv2.LINE_AA)
    cv2.putText(frame, text2, (frame.shape[1] - 200, frame.shape[0] - 20),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 100), 4, cv2.LINE_AA)
    return frame
    
#For testing



frames_of_interest_indices = []
for action in actions:
    start, end = get_window_start_end(action["time"])
    frames_of_interest_indices += list(range(start, end))

  
FRAMES = []
count = 0
while(cap.isOpened()):
    if (len(frames_of_interest_indices) == 0):
        break
    ret, frame = cap.read()
    if ret:
        if (frames_of_interest_indices[0] == count):
            FRAMES.append(frame)
            frames_of_interest_indices.pop(0)
    else:
        break
    count = count + 1
    
cap.release()
print("Video read, starting processing!")


processed = []
for i, frame in enumerate(FRAMES):
    action = actions[i // math.ceil(FPS * WINDOW_SIZE_BACK  + FPS * WINDOW_SIZE_FORW)]
    frame = add_player(frame, action["player"],  action["home"] if action["home_action"] else action["away"])
    frame = add_score(frame, action["home"], action["away"], action["home_score"], action["away_score"])
    frame = add_description(frame,  action["description"])
    processed.append(frame)

clip = ImageSequenceClip([cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                                for img in processed], fps = FPS)
clip.write_videofile("./output.mp4", codec="mpeg4")
    


