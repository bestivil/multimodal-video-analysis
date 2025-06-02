import sys
import json

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import TranscriptsDisabled, VideoUnavailable
except ModuleNotFoundError as e:
    print(json.dumps({"error": f"Module not found: {str(e)}"}))
    sys.exit(1)

def get_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return transcript
    except TranscriptsDisabled:
        return {"error": "Transcripts are disabled for this video."}
    except VideoUnavailable:
        return {"error": "The video is unavailable."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No video ID provided."}))
    else:
        video_id = sys.argv[1]
        transcript = get_transcript(video_id)
        print(json.dumps(transcript))