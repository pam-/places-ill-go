Rails.application.routes.draw do
	root "pins#new"
  resources :pins, only: [:index, :create, :new]
end
