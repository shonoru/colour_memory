class GameController < ApplicationController
  def index
  end
  
  def create
    hash = {
      'appid' => params[:app_id],
      'name' => params[:name],
      'email' => params[:email],
      'score' => params[:score]
    }
    @score = Highscore.new(hash)
    @score.save
  end
  
  def show_highscore
    @last_id = Highscore.last.id
    @highscores = Highscore.all(:order => 'score desc') # apply sort for that;
    
    i = 1
    @highscores.each do |h| 
      if h.id == @last_id
        h["current"] = true
      end
      h["rank"] = i
      i += 1
    end
    
    respond_to do |format|
      # format.html # show.html.erb
      format.json { render json: @highscores }
    end
  end
  
  def create_and_return
    hash = {
      'appid' => params[:app_id],
      'name' => params[:name].empty? ? 'Guest': params[:name],
      'email' => params[:email].empty? ? '' : params[:email],
      'score' => params[:score]
    }
    @score = Highscore.new(hash)
    @score.save
    
    @highscores = Highscore.all(:order => 'score desc') # apply sort for that;
    
    i = 1
    @highscores.each do |h| 
      if h.id == @score.id
        h["current"] = true
      end
      h["rank"] = i
      i += 1
    end
    
    respond_to do |format|
      # format.html # show.html.erb
      format.json { render json: @highscores }
    end
  end

end
