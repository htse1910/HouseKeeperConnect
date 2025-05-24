package com.example.housekeeperapplication.Model.DTOs;

public class RatingCreateDTO {
    private int Reviewer;
    private int Reviewee;
    private String Content;
    private int Score;


    public int getReviewer() {
        return Reviewer;
    }

    public void setReviewer(int reviewer) {
        Reviewer = reviewer;
    }

    public int getReviewee() {
        return Reviewee;
    }

    public void setReviewee(int reviewee) {
        Reviewee = reviewee;
    }

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
    }

    public int getScore() {
        return Score;
    }

    public void setScore(int score) {
        Score = score;
    }
}
