# frozen_string_literal: true

class CreateStudentAuth < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :preferred_locale, null: false, default: "es"
      t.datetime :email_verified_at
      t.string :reset_password_token
      t.datetime :reset_password_sent_at
      t.timestamps null: false
    end
    add_index :users, :email, unique: true
    add_index :users, :reset_password_token, unique: true

    create_table :user_identities do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider, null: false
      t.string :uid, null: false
      t.timestamps null: false
    end
    add_index :user_identities, [ :provider, :uid ], unique: true
    add_index :user_identities, [ :user_id, :provider ], unique: true

    create_table :refresh_tokens do |t|
      t.references :user, null: false, foreign_key: true
      t.string :token_digest, null: false
      t.uuid :family_id, null: false
      t.datetime :expires_at, null: false
      t.datetime :revoked_at
      t.timestamps null: false
    end
    add_index :refresh_tokens, :token_digest, unique: true
    add_index :refresh_tokens, :family_id
  end
end
