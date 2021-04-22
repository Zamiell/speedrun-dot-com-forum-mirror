package main

import (
	"fmt"
	"time"

	"github.com/anaskhan96/soup"
)

const (
	SpeedrunURL            = "https://speedrun.com/"
	SpeedrunURLForumSuffix = "/forum"
	SecondsToSleep         = 30
)

var (
	// Key is the short-hand game URL, value is the full game title.
	gameMap = map[string]string{
		"isaac":          "Wrath of the Lamb",
		"isaacrebirth":   "Rebirth",
		"afterbirth":     "Afterbirth",
		"afterbirthplus": "Afterbirth+",
		"repentance":     "Repentance",
	}

	// Key is the forum link, value is the number of replies.
	threadMap = make(map[string]string)
)

func speedrunInit() {
	// Initialize all of the threads in memory
	checkAllGames(true)

	for {
		time.Sleep(SecondsToSleep * time.Second)
		checkAllGames(false)
	}
}

func checkAllGames(initialRun bool) {
	logger.Info("Checking for new forum posts on Speedrun.com...")
	for gameURL, gameTitle := range gameMap {
		checkGame(gameURL, gameTitle, initialRun)
	}
}

func checkGame(gameURL string, gameTitle string, initialRun bool) {
	url := SpeedrunURL + gameURL + SpeedrunURLForumSuffix

	// We use the "soup" library to fetch and parse the HTML
	var resp string
	if v, err := soup.Get(url); err != nil {
		logger.Errorf("Failed to fetch the forum HTML for %s: %s", gameTitle, err.Error())
		return
	} else {
		resp = v
	}

	doc := soup.HTMLParse(resp)
	panels := doc.FindAll("div", "class", "panel")
	// There are 3 panels on the page and we need the bottom-most one
	lastPanel := panels[len(panels)-1]
	tableRows := lastPanel.FindAll("tr")

	for _, tableRow := range tableRows {
		checkGameTableRow(tableRow, gameTitle, initialRun)
	}
}

func checkGameTableRow(tableRow soup.Root, gameTitle string, initialRun bool) {
	var link string
	if v, ok := tableRow.Attrs()["data-target"]; !ok {
		return
	} else {
		link = v
	}

	// This is a row for a forum post
	dataElements := tableRow.FindAll("td")
	if len(dataElements) != 6 { // nolint: gomnd
		logger.Errorf("Failed to parse the data elements for thread: %s", link)
		return
	}

	// The 1st <td> has a class of "forum-cell-new" and contains the "New" tag (if it is new)
	// newCell := dataElements[0]
	// The 2nd <td> contains the thread title
	// It has no corresponding class, so we must get all <td> elements to find it
	titleCell := dataElements[1]
	// The 3rd <td> has a class of "forum-cell-user",
	// which holds the username of the person who created the thread
	// userCell := dataElements[2]
	// The 4th <td> has a class of "forum-cell-posts", which holds the number of replies
	repliesCell := dataElements[3]
	// The 5th <td> has a class of "forum-cell-views", which holds the number of views
	// viewsCell := dataElements[4]
	// The 6th <td> has a class of "forum-cell-lastpost", which holds the last reply
	lastReplyCell := dataElements[5]

	threadTitle := titleCell.Find("a").Text()
	if len(threadTitle) == 0 {
		logger.Errorf("Failed to parse the title for thread: %s", link)
		return
	}

	numReplies := repliesCell.Text()
	if numReplies == "" {
		logger.Errorf("Failed to parse the number of replies for thread: %s", link)
		return
	}

	// Get the last reply link
	lastReplyLinkAttrs := lastReplyCell.Find("a").Attrs()
	var lastReplyLink string
	if v, ok := lastReplyLinkAttrs["href"]; !ok {
		logger.Errorf("Failed to parse the href of the last replay for thread: %s", link)
		return
	} else {
		lastReplyLink = v
	}
	if lastReplyLink == "" {
		logger.Errorf("Failed to parse the link of the last replay for thread: %s", link)
		return
	}

	// Get the username of the last reply
	lastReplaySmall := lastReplyCell.Find("small")
	var username string
	if lastReplaySmall.Text() == "by [Deleted user]" {
		username = "Deleted user"
	} else {
		// We have to use "FullText()" instead of "Text()" because some users will display like so:
		/*
			<span class="username-light">
				<span style="color:#ee2d88">t</span>
				<span style="color:#e2288b">i</span>
				<span style="color:#d7248e">t</span>
				<span style="color:#cc2092">o</span>
				<span style="color:#c11c95">n</span>
				<span style="color:#b61899">c</span>
				<span style="color:#ab149c">i</span>
				<span style="color:#a00fa0">o</span>
			</span>
		*/
		username = lastReplaySmall.Find("a").Find("span").Find("span").FullText()
	}
	if username == "" {
		logger.Errorf("Failed to parse the username of the last reply for thread: %s", link)
		return
	}

	if oldNumReplies, ok := threadMap[link]; !ok {
		// This is a new link; keep track of it in the map
		threadMap[link] = numReplies

		if !initialRun {
			msg := formatMsg(true, gameTitle, threadTitle, username)
			discordSend(discordOutputChannelID, msg)
		}
	} else if numReplies != oldNumReplies {
		// This is a previously-seen link and the number of replies has changed
		msg := formatMsg(false, gameTitle, threadTitle, username)
		discordSend(discordOutputChannelID, msg)
	}
}

func formatMsg(newThread bool, gameTitle string, threadTitle string, username string) string {
	noun := "thread"
	if !newThread {
		noun = "reply"
	}
	return fmt.Sprintf("New %s for %s: [%s] by <%s>", noun, gameTitle, threadTitle, username)
}
