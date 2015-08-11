require 'mechanize'
require 'json'

class Episode
  ROOT_URL = 'https://gorails.com'
  attr_accessor :episodes, :agent

  def initialize
    self.episodes = []
  end

  def fetch(path)
    page = get_page(path)

    page.search('.lesson-card').each do |lesson|
      title = lesson.at('h3').content.strip
      path = lesson[:href]
      is_pro = !lesson.at('.label-danger').nil?
      puts "[fetch] #{title} (#{path})"
      episode = {
        url: "#{ROOT_URL}#{path}",
        title: title,
        hearts: lesson.at('.episode-hearts').content.to_i,
        is_pro: is_pro,
      }
      episodes << episode
    end

    next_link = page.search('a[rel=next]')
    unless next_link.empty?
      path = next_link.first[:href]
      puts "[next] #{path}"
      fetch(next_link.first[:href])
    end

    sequential_id = 1
    episodes.reverse.each do |e|
      e[:sequential_id] = sequential_id
      sequential_id += 1
    end
  end

  private
    def get_page(path)
      sleep(3)
      agent = Mechanize.new
      agent.user_agent_alias = 'Mac Safari'
      agent.get("#{ROOT_URL}#{path}")
    end
end


task :fetch do
  puts 'Start'
  e = Episode.new
  e.fetch('/episodes')
  json = JSON.pretty_generate(e.episodes)
  File.write('./episodes.json', json)
  puts 'Done'

  meta = { fetched_at: Time.now.to_i * 1000 }
  File.write('./assets/js/meta.js', "var Meta = #{JSON.pretty_generate(meta)};")
end

