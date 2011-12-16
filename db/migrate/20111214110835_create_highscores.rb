class CreateHighscores < ActiveRecord::Migration
  def change
    create_table :highscores do |t|
      t.string :appid
      t.string :name
      t.string :email
      t.integer :score

      t.timestamps
    end
  end
end
